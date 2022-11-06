import store, { createEffect } from "@lincode/reactivity"
import { isPositionedItem } from "../api/core/PositionedItem"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { getEditorMode } from "./useEditorMode"
import { getSelectionTarget } from "./useSelectionTarget"

export const [setEditorModeComputed, getEditorModeComputed] = store(
    getEditorMode()
)

createEffect(() => {
    const target = getSelectionTarget()
    const mode = getEditorMode()

    if (
        !target ||
        (mode !== "rotate" && mode !== "scale" && mode !== "translate")
    ) {
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
