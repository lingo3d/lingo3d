import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"
import { getEditorMounted } from "./useEditorMounted"

export const [setEditorPlay, getEditorPlay] = store(false)

createEffect(() => {
    setEditorPlay(getCameraRendered() !== mainCamera || !getEditorMounted())
}, [getCameraRendered, getEditorMounted])
