import store, { createEffect } from "@lincode/reactivity"
import { EditorMode, getEditorMode } from "./useEditorMode"
import { getSelectionTarget } from "./useSelectionTarget"
import { getWorldMode } from "./useWorldMode"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { worldModePtr } from "../pointers/worldModePtr"

export const [setEditorModeComputed, getEditorModeComputed] = store<
    EditorMode | undefined
>(undefined)

createEffect(() => {
    const [target] = selectionTargetPtr
    const mode = getEditorMode()

    if (worldModePtr[0] !== "editor") {
        setEditorModeComputed(undefined)
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
}, [getEditorMode, getSelectionTarget, getWorldMode])
