import { event } from "@lincode/events"
import { TransformControlsPayload } from "./onTransformControls"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import { CommandRecord, UpdateCommand, pushUndoStack } from "../api/undoStack"
import { flushMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import MeshAppendable from "../display/core/MeshAppendable"
import { emitTransformEdit } from "./onTransformEdit"

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
        target instanceof MeshAppendable &&
            emitTransformEdit({ target, phase, mode: payload.mode })

    updateSelectionManagersPhysics(payload)
})

let commandRecord: CommandRecord = {}
onEditorEdit(({ phase, key, value }) => {
    if (phase === "start") {
        flushMultipleSelectionTargets(() => {
            for (const target of getAllSelectionTargets())
                commandRecord[target.uuid] = {
                    command: "update",
                    commandPrev: { [key]: value }
                }
        })
        return
    }
    flushMultipleSelectionTargets(() => {
        for (const target of getAllSelectionTargets())
            (commandRecord[target.uuid] as UpdateCommand).commandNext = {
                [key]: value
            }
        pushUndoStack(commandRecord)
        commandRecord = {}
    })
})
