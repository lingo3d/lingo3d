import store, { createEffect } from "@lincode/reactivity"
import settings from "../api/settings"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { getEditorCamera, setEditorCamera } from "./useEditorCamera"
import { getEditorCameraManual } from "./useEditorCameraManual"
import { getTimelineFrame } from "./useTimelineFrame"
import { getTimelinePaused } from "./useTimelinePaused"

export const [setCameraComputed, getCameraComputed] = store(mainCamera)

createEffect(() => {
    setCameraComputed(
        getEditorCamera() ?? getCameraStack().at(-1) ?? mainCamera
    )
}, [getCameraStack, getEditorCamera])

const changeCam = () => {
    setEditorCamera(getCameraStack().at(-1) ?? getEditorCamera() ?? mainCamera)
}

//mark
getTimelinePaused((val) => {
    if (val) return
    changeCam()
    settings.uiLayer = true
})

//mark
createEffect(() => {
    if (getEditorCameraManual() || !getTimelinePaused()) return
    const handle = getTimelineFrame(changeCam)
    return () => {
        handle.cancel()
    }
}, [getTimelinePaused, getEditorCameraManual])
