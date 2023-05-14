import { event } from "@lincode/events"
import { TransformControlsPayload } from "./onTransformControls"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import { CommandRecord, UpdateCommand, pushUndoStack } from "../api/undoStack"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import { flushMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"

export const [emitEditorEdit, onEditorEdit] = event<{
    phase: "start" | "end"
    key: string
    value: any
}>()

onEditorEdit(({ phase, key }) => {
    let payload: TransformControlsPayload | undefined
    if (key === "x" || key === "y" || key === "z")
        payload = { phase, mode: "translate" }
    else if (key.startsWith("rotation")) payload = { phase, mode: "rotate" }
    else if (key.startsWith("scale")) payload = { phase, mode: "scale" }
    if (!payload) return

    for (const target of getAllSelectionTargets())
        target.$emitEvent("transformEdit", payload)

    updateSelectionManagersPhysics(payload)
})

let commandRecord: CommandRecord = {}
onEditorEdit(({ phase, key, value }) => {
    if (phase === "start") {
        flushMultipleSelectionTargets((targets) => {
            for (const target of [...targets, selectionTargetPtr[0]])
                if (target)
                    commandRecord[target.uuid] = {
                        command: "update",
                        prev: { [key]: value }
                    }
        })
        return
    }
    flushMultipleSelectionTargets((targets) => {
        for (const target of [...targets, selectionTargetPtr[0]])
            if (target)
                (commandRecord[target.uuid] as UpdateCommand).next = {
                    [key]: value
                }
        pushUndoStack(commandRecord)
        commandRecord = {}
    })
})
