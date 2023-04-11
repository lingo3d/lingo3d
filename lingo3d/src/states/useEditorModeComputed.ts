import store, { createEffect } from "@lincode/reactivity"
import { EditorMode, getEditorMode } from "./useEditorMode"
import { getSelectionTarget } from "./useSelectionTarget"
import { getWorldPlay } from "./useWorldPlay"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"

export const [setEditorModeComputed, getEditorModeComputed] = store<
    EditorMode | "play"
>(getEditorMode())

createEffect(() => {
    const [target] = selectionTargetPtr
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
