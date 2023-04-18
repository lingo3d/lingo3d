import { event } from "@lincode/events"
import { createEffect } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { getEditorBehavior } from "../states/useEditorBehavior"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { onTransformControls } from "./onTransformControls"

export const [emitEditorEdit, onEditorEdit] = event<"start" | "end">()

createEffect(() => {
    if (!getEditorBehavior()) return

    const [selectionTarget] = selectionTargetPtr

    const eventTargets: Array<Appendable> = []
    selectionTarget && eventTargets.push(selectionTarget)
    for (const target of getMultipleSelectionTargets()[0])
        eventTargets.push(target)

    const handleEdit = (phase: "start" | "end" | "move") => {
        if (phase !== "end") return
        for (const target of eventTargets) {
            target.emitEvent("edit")
            if (target.disableSceneGraph) {
                target.disableSceneGraph = false
                target.disableSerialize = false
            }
        }
    }
    const handle0 = onEditorEdit(handleEdit)
    const handle1 = onTransformControls(handleEdit)
    return () => {
        handle0.cancel()
        handle1.cancel()
    }
}, [getEditorBehavior, getSelectionTarget])
