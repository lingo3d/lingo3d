import { CameraHelper, PerspectiveCamera } from "three"
import mainCamera from "../../../engine/mainCamera"
import scene from "../../../engine/scene"
import { bokehDefault } from "../../../states/useBokeh"
import { bokehApertureDefault } from "../../../states/useBokehAperture"
import { bokehFocusDefault } from "../../../states/useBokehFocus"
import { bokehMaxBlurDefault } from "../../../states/useBokehMaxBlur"
import { getCameraStack, pullCameraStack, pushCameraStack } from "../../../states/useCameraStack"
import { pushCameraList, pullCameraList } from "../../../states/useCameraList"
import EventLoopItem from "../../../api/core/EventLoopItem"
import ICameraMixin from "../../../interface/ICameraMixin"
import makeCameraSprite from "../utils/makeCameraSprite"
import { emitSelectionTarget, onSelectionTarget } from "../../../events/onSelectionTarget"
import { setCameraFrom } from "../../../states/useCameraFrom"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { setBokehRefresh } from "../../../states/useBokehRefresh"
import { last } from "@lincode/utils"

export default abstract class CameraMixin<T extends PerspectiveCamera> extends EventLoopItem implements ICameraMixin {
    protected abstract camera: T
    public abstract minPolarAngle: number
    public abstract maxPolarAngle: number

    protected initCamera() {
        this.camera.userData.manager = this
        this.camera.rotation.y = Math.PI

        pushCameraList(this.camera)
        this.then(() => {
            this.active && setCameraFrom(undefined)
            pullCameraStack(this.camera)
            pullCameraList(this.camera)
        })

        this.createEffect(() => {
            if (getCameraRendered() !== mainCamera || getCameraRendered() === this.camera)
                return

            const helper = new CameraHelper(this.camera)
            scene.add(helper)

            const sprite = makeCameraSprite()
            helper.add(sprite.outerObject3d)

            const handle = onSelectionTarget(({ target }) => {
                target === sprite && emitSelectionTarget(this as any)
            })
            return () => {
                helper.dispose()
                scene.remove(helper)
                
                sprite.dispose()
                handle.cancel()
            }
        }, [getCameraRendered])
    }

    public get fov() {
        return this.camera.fov
    }
    public set fov(val) {
        this.camera.fov = val
        this.camera.updateProjectionMatrix?.()
    }

    public get zoom() {
        return this.camera.zoom
    }
    public set zoom(val) {
        this.camera.zoom = val
        this.camera.updateProjectionMatrix?.()
    }

    public get near() {
        return this.camera.near
    }
    public set near(val) {
        this.camera.near = val
        this.camera.updateProjectionMatrix?.()
    }

    public get far() {
        return this.camera.far
    }
    public set far(val) {
        this.camera.far = val
        this.camera.updateProjectionMatrix?.()
    }

    public activate() {
        const cameraFrom = last(getCameraStack())
        if (cameraFrom === this.camera) return

        pullCameraStack(this.camera)
        pushCameraStack(this.camera)
        setCameraFrom(cameraFrom)
    }

    public get active() {
        return last(getCameraStack()) === this.camera
    }
    public set active(val) {
        if (val === this.active) return

        if (val)
            this.activate()
        else
            pullCameraStack(this.camera)
    }

    public get transition() {
        return this.camera.userData.transition as boolean | number | undefined
    }
    public set transition(val) {
        this.camera.userData.transition = val
    }

    public get bokeh() {
        return this.camera.userData.bokeh ?? bokehDefault
    }
    public set bokeh(val) {
        this.camera.userData.bokeh = val
        setBokehRefresh({})
    }
    
    public get bokehFocus() {
        return this.camera.userData.bokehFocus ?? bokehFocusDefault
    }
    public set bokehFocus(val) {
        this.camera.userData.bokehFocus = val
        setBokehRefresh({})
    }

    public get bokehMaxBlur() {
        return this.camera.userData.bokehMaxBlur ?? bokehMaxBlurDefault
    }
    public set bokehMaxBlur(val) {
        this.camera.userData.bokehMaxBlur = val
        setBokehRefresh({})
    }

    public get bokehAperture() {
        return this.camera.userData.bokehAperture ?? bokehApertureDefault
    }
    public set bokehAperture(val) {
        this.camera.userData.bokehAperture = val
        setBokehRefresh({})
    }
}