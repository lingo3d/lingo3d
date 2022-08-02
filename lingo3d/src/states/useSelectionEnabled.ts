import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"
import { getEditorMounted } from "./useEditorMounted"

export const [setSelectionEnabled, getSelectionEnabled] = store(false)

createEffect(() => {
    setSelectionEnabled(
        getCameraRendered() === mainCamera && !!getEditorMounted()
    )
}, [getCameraRendered, getEditorMounted])
