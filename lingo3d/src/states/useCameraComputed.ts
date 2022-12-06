import store, { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { getEditorCamera } from "./useEditorCamera"
import { getTimelinePaused } from "./useTimelinePaused"

export const [setCameraComputed, getCameraComputed] = store(mainCamera)

createEffect(() => {
    const activeCamera = last(getCameraStack()) ?? mainCamera
    if (!getTimelinePaused()) {
        setCameraComputed(activeCamera)
        return
    }
    setCameraComputed(getEditorCamera() ?? activeCamera)
}, [getCameraStack, getEditorCamera, getTimelinePaused])
