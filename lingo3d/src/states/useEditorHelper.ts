import { createEffect, store } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"
import { getEditorBehavior } from "./useEditorBehavior"
import { getWorldPlayComputed } from "./useWorldPlayComputed"

const [setEditorHelper, getEditorHelper] = store(false)
export { getEditorHelper }

createEffect(() => {
    setEditorHelper(
        getEditorBehavior() &&
            !getWorldPlayComputed() &&
            getCameraRendered() === mainCamera
    )
}, [getEditorBehavior, getCameraRendered, getWorldPlayComputed])
