import store, { createEffect } from "@lincode/reactivity"
import { last } from "@lincode/utils"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { getEditorCamera } from "./useEditorCamera"

export const [setCameraComputed, getCameraComputed] = store(mainCamera)

createEffect(() => {
    setCameraComputed(getEditorCamera() ?? last(getCameraStack()) ?? mainCamera)
}, [getCameraStack, getEditorCamera])
