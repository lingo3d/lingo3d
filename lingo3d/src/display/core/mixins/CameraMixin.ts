import { CameraHelper, PerspectiveCamera } from "three"
import mainCamera from "../../../engine/mainCamera"
import scene from "../../../engine/scene"
import { bokehDefault, setBokeh } from "../../../states/useBokeh"
import { bokehApertureDefault, setBokehAperture } from "../../../states/useBokehAperture"
import { bokehFocusDefault, setBokehFocus } from "../../../states/useBokehFocus"
import { bokehMaxBlurDefault, setBokehMaxBlur } from "../../../states/useBokehMaxBlur"
import { getCamera, setCamera } from "../../../states/useCamera"
import { pushCameraList, pullCameraList } from "../../../states/useCameraList"
import EventLoopItem from "../../../api/core/EventLoopItem"
import ICameraMixin from "../../../interface/ICameraMixin"
import makeCameraSprite from "../utils/makeCameraSprite"
import { emitSelectionTarget, onSelectionTarget } from "../../../events/onSelectionTarget"
import { getCameraInterpolate, setCameraInterpolate } from "../../../states/useCameraInterpolate"
import { setCameraFrom } from "../../../states/useCameraFrom"

export default abstract class CameraMixin<T extends PerspectiveCamera> extends EventLoopItem implements ICameraMixin {
    protected abstract camera: T
    public abstract minPolarAngle: number
    public abstract maxPolarAngle: number

    protected initCamera(this: EventLoopItem & CameraMixin<T>) {
        this.camera.userData.manager = this

        pushCameraList(this.camera)
        this.then(() => {
            if (this.active) {
                setCamera(mainCamera)
                setCameraFrom(undefined)
                setCameraInterpolate(false)
            }
            pullCameraList(this.camera)
        })

        this.createEffect(() => {
            if (getCamera() !== mainCamera || getCamera() === this.camera)
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
        }, [getCamera])
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

    public activate(interpolate?: boolean) {
        const cameraFrom = getCamera()
        if (cameraFrom === this.camera) return

        setCamera(this.camera)
        setCameraFrom(cameraFrom)
        setCameraInterpolate(!!interpolate)
    }

    public get active() {
        if (getCamera() === this.camera) {
            if (getCameraInterpolate()) return "transition"
            return true
        }
        return false
    }
    public set active(val) {
        val && this.activate(val === "transition")
    }

    public get bokeh() {
        return this.camera.userData.bokeh ?? bokehDefault
    }
    public set bokeh(val) {
        getCamera() === this.camera && setBokeh(val)
        this.camera.userData.bokeh = val
    }
    
    public get bokehFocus() {
        return this.camera.userData.bokehFocus ?? bokehFocusDefault
    }
    public set bokehFocus(val) {
        getCamera() === this.camera && setBokehFocus(val)
        this.camera.userData.bokehFocus = val
    }

    public get bokehMaxBlur() {
        return this.camera.userData.bokehMaxBlur ?? bokehMaxBlurDefault
    }
    public set bokehMaxBlur(val) {
        getCamera() === this.camera && setBokehMaxBlur(val)
        this.camera.userData.bokehMaxBlur = val
    }

    public get bokehAperture() {
        return this.camera.userData.bokehAperture ?? bokehApertureDefault
    }
    public set bokehAperture(val) {
        getCamera() === this.camera && setBokehAperture(val)
        this.camera.userData.bokehAperture = val
    }
}