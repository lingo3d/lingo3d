import store, { createEffect } from "@lincode/reactivity"
import { getEditorMode } from "./useEditorMode"
import { getSelectionTarget } from "./useSelectionTarget"
import { getWorldPlay } from "./useWorldPlay"

export const [setEditorModeComputed, getEditorModeComputed] = store(
    getEditorMode()
)

Promise.all([
    import("../api/core/PositionedItem"),
    import("../display/core/SimpleObjectManager")
]).then(([{ isPositionedItem }, { default: SimpleObjectManager }]) => {
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
        if (!isPositionedItem(target)) {
            setEditorModeComputed("select")
            return
        }
        if (!(target instanceof SimpleObjectManager)) {
            setEditorModeComputed("translate")
            return
        }
        setEditorModeComputed(mode)
    }, [getEditorMode, getSelectionTarget, getWorldPlay])
})
