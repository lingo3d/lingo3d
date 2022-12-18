import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { getEditorCamera } from "./useEditorCamera"
import { getTimelinePaused } from "./useTimelinePaused"
import { getWorldPlay } from "./useWorldPlay"

export const [setCameraComputed, getCameraComputed] = store(mainCamera)

createEffect(() => {
    if (!getTimelinePaused() || getWorldPlay()) {
        setCameraComputed(
            getCameraStack().at(-1) ?? getEditorCamera() ?? mainCamera
        )
        return
    }
    setCameraComputed(
        getEditorCamera() ?? getCameraStack().at(-1) ?? mainCamera
    )
}, [getCameraStack, getEditorCamera, getTimelinePaused, getWorldPlay])
