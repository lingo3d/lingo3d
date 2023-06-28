import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { getEditorCamera } from "./useEditorCamera"
import { getTimelinePaused } from "./useTimelinePaused"
import { getWorldMode } from "./useWorldMode"
import { timelinePausedPtr } from "../pointers/timelinePausedPtr"
import { worldModePtr } from "../pointers/worldModePtr"

export const [setCameraComputed, getCameraComputed] = store(mainCamera)

createEffect(() => {
    if (!timelinePausedPtr[0] || worldModePtr[0] === "default") {
        setCameraComputed(
            getCameraStack().at(-1) ?? getEditorCamera() ?? mainCamera
        )
        return
    }
    setCameraComputed(
        getEditorCamera() ?? getCameraStack().at(-1) ?? mainCamera
    )
}, [getCameraStack, getEditorCamera, getTimelinePaused, getWorldMode])
