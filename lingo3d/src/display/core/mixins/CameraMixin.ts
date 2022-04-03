import { Camera, CameraHelper } from "three"
import mainCamera from "../../../engine/mainCamera"
import scene from "../../../engine/scene"
import { bokehDefault, setBokeh } from "../../../states/useBokeh"
import { bokehApertureDefault, setBokehAperture } from "../../../states/useBokehAperture"
import { bokehFocusDefault, setBokehFocus } from "../../../states/useBokehFocus"
import { bokehMaxBlurDefault, setBokehMaxBlur } from "../../../states/useBokehMaxBlur"
import { getCamera, setCamera } from "../../../states/useCamera"
import { getCameraHelper } from "../../../states/useCameraHelper"
import { pushCameraList, pullCameraList } from "../../../states/useCameraList"
import EventLoopItem from "../../../api/core/EventLoopItem"
import ICameraMixin from "../../../interface/ICameraMixin"

export default abstract class CameraMixin<T extends Camera> extends EventLoopItem implements ICameraMixin {
    protected abstract camera: T

    protected initCamera(this: EventLoopItem & CameraMixin<T>) {
        pushCameraList(this.camera)
        this.then(() => {
            this.active && setCamera(mainCamera)
            pullCameraList(this.camera)
        })

        this.createEffect(() => {
            if (!getCameraHelper() || getCamera() !== mainCamera || getCamera() === this.camera)
                return

            const helper = new CameraHelper(this.camera)
            scene.add(helper)

            return () => {
                helper.dispose()
                scene.remove(helper)
            }
        }, [getCamera, getCameraHelper])
    }

    public get fov() {
        //@ts-ignore
        return this.camera.fov
    }
    public set fov(val: number) {
        //@ts-ignore
        this.camera.fov = val
        //@ts-ignore
        this.camera.updateProjectionMatrix?.()
    }

    public get zoom() {
        //@ts-ignore
        return this.camera.zoom
    }
    public set zoom(val: number) {
        //@ts-ignore
        this.camera.zoom = val
        //@ts-ignore
        this.camera.updateProjectionMatrix?.()
    }

    public get near() {
        //@ts-ignore
        return this.camera.near
    }
    public set near(val: number) {
        //@ts-ignore
        this.camera.near = val
        //@ts-ignore
        this.camera.updateProjectionMatrix?.()
    }

    public get far() {
        //@ts-ignore
        return this.camera.far
    }
    public set far(val: number) {
        //@ts-ignore
        this.camera.far = val
        //@ts-ignore
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