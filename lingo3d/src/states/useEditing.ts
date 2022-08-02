import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"
import { getEditorMounted } from "./useEditorMounted"

export const [setEditing, getEditing] = store(false)

createEffect(() => {
    setEditing(getCameraRendered() === mainCamera && !!getEditorMounted())
}, [getCameraRendered, getEditorMounted])
