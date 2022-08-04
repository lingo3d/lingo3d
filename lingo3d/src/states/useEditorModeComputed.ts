import store, { createEffect } from "@lincode/reactivity"
import { isPositionedItem } from "../api/core/PositionedItem"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { getSelectionTarget } from "./useSelectionTarget"
import { getEditorMode } from "./useEditorMode"

export const [setEditorModeComputed, getEditorModeComputed] = store(
    getEditorMode()
)

createEffect(() => {
    const target = getSelectionTarget()
    const mode = getEditorMode()

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
}, [getEditorMode, getSelectionTarget])
