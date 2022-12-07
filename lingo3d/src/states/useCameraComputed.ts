import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { getEditorCamera, setEditorCamera } from "./useEditorCamera"
import { getTimelinePaused } from "./useTimelinePaused"

export const [setCameraComputed, getCameraComputed] = store(mainCamera)

createEffect(() => {
    setCameraComputed(
        getEditorCamera() ?? getCameraStack().at(-1) ?? mainCamera
    )
}, [getCameraStack, getEditorCamera])

getTimelinePaused(
    (val) =>
        !val &&
        setEditorCamera(
            getCameraStack().at(-1) ?? getEditorCamera() ?? mainCamera
        )
)
