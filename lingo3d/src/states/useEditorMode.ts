import store, { createEffect } from "@lincode/reactivity"
import mainCamera from "../engine/mainCamera"
import { getCameraRendered } from "./useCameraRendered"
import { getEditorMounted } from "./useEditorMounted"

type Mode =
    | "translate"
    | "rotate"
    | "scale"
    | "select"
    | "play"
    | "mesh"
    | "curve"

export const [setEditorMode, getEditorMode] = store<Mode>("play")

createEffect(() => {
    setEditorMode(
        getCameraRendered() === mainCamera && getEditorMounted()
            ? "translate"
            : "play"
    )
}, [getCameraRendered, getEditorMounted])
