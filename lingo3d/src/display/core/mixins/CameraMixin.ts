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

export default abstract class CameraMixin<T extends PerspectiveCamera> extends EventLoopItem implements ICameraMixin {
    protected abstract camera: T
    public abstract minPolarAngle: number
    public abstract maxPolarAngle: number

    protected initCamera(this: EventLoopItem & CameraMixin<T>) {
        pushCameraList(this.camera)
        this.then(() => {
            this.active && setCamera(mainCamera)
            pullCameraList(this.camera)
        })

        this.createEffect(() => {
            if (getCamera() !== mainCamera || getCamera() === this.camera)
                return

            const helper = new CameraHelper(this.camera)
            scene.add(helper)

            const sprite = makeCameraSprite()
            helper.add(sprite.outerObject3d)

            const handle = onSelectionTarget(target => {
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
    public set fov(val: number) {
        this.camera.fov = val
        this.camera.updateProjectionMatrix?.()
    }

    public get zoom() {
        return this.camera.zoom
    }
    public set zoom(val: number) {
        this.camera.zoom = val
        this.camera.updateProjectionMatrix?.()
    }

    public get near() {
        return this.camera.near
    }
    public set near(val: number) {
        this.camera.near = val
        this.camera.updateProjectionMatrix?.()
    }

    public get far() {
        return this.camera.far
    }
    public set far(val: number) {
        this.camera.far = val
        this.camera.updateProjectionMatrix?.()
    }

    public activate() {
        setCamera(this.camera)
    }

    public get active() {
        return getCamera() === this.camera
    }
    public set active(val: boolean) {
        val && this.activate()
    }

    public get bokeh() {
        return this.camera.userData.bokeh ?? bokehDefault
    }
    public set bokeh(val: boolean) {
        getCamera() === this.camera && setBokeh(val)
        this.camera.userData.bokeh = val
    }
    
    public get bokehFocus() {
        return this.camera.userData.bokehFocus ?? bokehFocusDefault
    }
    public set bokehFocus(val: number) {
        getCamera() === this.camera && setBokehFocus(val)
        this.camera.userData.bokehFocus = val
    }

    public get bokehMaxBlur() {
        return this.camera.userData.bokehMaxBlur ?? bokehMaxBlurDefault
    }
    public set bokehMaxBlur(val: number) {
        getCamera() === this.camera && setBokehMaxBlur(val)
        this.camera.userData.bokehMaxBlur = val
    }

    public get bokehAperture() {
        return this.camera.userData.bokehAperture ?? bokehApertureDefault
    }
    public set bokehAperture(val: number) {
        getCamera() === this.camera && setBokehAperture(val)
        this.camera.userData.bokehAperture = val
    }
}