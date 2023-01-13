import store, { createEffect } from "@lincode/reactivity"
import { EditorMode, getEditorMode } from "./useEditorMode"
import { getSelectionTarget } from "./useSelectionTarget"
import { getWorldPlay } from "./useWorldPlay"

export const [setEditorModeComputed, getEditorModeComputed] = store<
    EditorMode | "play"
>(getEditorMode())

createEffect(() => {
    const target = getSelectionTarget()
    const mode = getEditorMode()

    if (getWorldPlay()) {
        setEditorModeComputed("play")
        return
    }
    if (
        !target ||
        (mode !== "rotate" && mode !== "scale" && mode !== "translate")
    ) {
        setEditorModeComputed(mode)
        return
    }
    if (!("x" in target)) {
        setEditorModeComputed("select")
        return
    }
    if (!("rotationX" in target)) {
        setEditorModeComputed("translate")
        return
    }
    setEditorModeComputed(mode)
}, [getEditorMode, getSelectionTarget, getWorldPlay])
