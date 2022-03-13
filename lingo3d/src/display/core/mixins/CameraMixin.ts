import { createEffect } from "@lincode/reactivity"
import { Camera, CameraHelper } from "three"
import mainCamera from "../../../engine/mainCamera"
import scene from "../../../engine/scene"
import { getBokeh, setBokeh } from "../../../states/useBokeh"
import { getBokehAperture, setBokehAperture } from "../../../states/useBokehAperture"
import { getBokehFocus, setBokehFocus } from "../../../states/useBokehFocus"
import { getBokehMaxBlur, setBokehMaxBlur } from "../../../states/useBokehMaxBlur"
import { getCamera, setCamera } from "../../../states/useCamera"
import { getCameraHelper } from "../../../states/useCameraHelper"
import { pushCameraList, pullCameraList } from "../../../states/useCameraList"
import EventLoopItem from "../../../api/core/EventLoopItem"
import ICameraMixin from "../../../interface/ICameraMixin"

export default abstract class CameraMixin<T extends Camera> implements ICameraMixin {
    protected abstract camera: T

    protected initCamera(this: EventLoopItem & CameraMixin<T>) {
        pushCameraList(this.camera)
        this.then(() => pullCameraList(this.camera))

        this.watch(createEffect(() => {
            if (!getCameraHelper() || getCamera() !== mainCamera || getCamera() === this.camera)
                return

            const helper = new CameraHelper(this.camera)
            scene.add(helper)

            return () => {
                helper.dispose()
                scene.remove(helper)
            }
        }, [getCamera, getCameraHelper]))
    }

    public get fov() {
        //@ts-ignore
        return this.camera.fov
    }
    public set fov(val: number) {
        //@ts-ignore
        this.camera.fov = val
        //@ts-ignore
        "updateProjectionMatrix" in this.camera && this.camera.updateProjectionMatrix()
    }

    public get zoom() {
        //@ts-ignore
        return this.camera.zoom
    }
    public set zoom(val: number) {
        //@ts-ignore
        this.camera.zoom = val
        //@ts-ignore
        "updateProjectionMatrix" in this.camera && this.camera.updateProjectionMatrix()
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
        return getBokeh()
    }
    public set bokeh(val: boolean) {
        getCamera() === this.camera && setBokeh(val)
        this.camera.userData.bokeh = val
    }
    
    public get bokehFocus() {
        return getBokehFocus()
    }
    public set bokehFocus(val: number) {
        getCamera() === this.camera && setBokehFocus(val)
        this.camera.userData.bokehFocus = val
    }

    public get bokehMaxBlur() {
        return getBokehMaxBlur()
    }
    public set bokehMaxBlur(val: number) {
        getCamera() === this.camera && setBokehMaxBlur(val)
        this.camera.userData.bokehMaxBlur = val
    }

    public get bokehAperture() {
        return getBokehAperture()
    }
    public set bokehAperture(val: number) {
        getCamera() === this.camera && setBokehAperture(val)
        this.camera.userData.bokehAperture = val
    }
}