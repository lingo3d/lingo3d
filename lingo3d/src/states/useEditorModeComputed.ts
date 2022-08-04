import store, { createEffect } from "@lincode/reactivity"
import { isPositionedItem } from "../api/core/PositionedItem"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { getEditing } from "./useEditing"
import { getSelectionTarget } from "./useSelectionTarget"
import { getEditorMode, Mode } from "./useEditorMode"

export const [setEditorModeComputed, getEditorModeComputed] = store<
    Mode | "none"
>(getEditorMode())

createEffect(() => {
    const target = getSelectionTarget()
    const mode = getEditorMode()

    if (!getEditing()) {
        setEditorModeComputed("none")
        return
    }
    if (!target || mode === "select") {
        setEditorModeComputed(mode)
        return
    }
    if (!isPositionedItem(target)) {
        setEditorModeComputed("select")
        return
    }
    if (!(target instanceof SimpleObjectManager)) {
        setEditorModeComputed("translate")
        return
    }
    setEditorModeComputed(mode)
}, [getEditorMode, getSelectionTarget, getEditing])
