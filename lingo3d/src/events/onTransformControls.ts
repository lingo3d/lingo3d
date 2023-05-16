import { event } from "@lincode/events"
import { transformControlsModePtr } from "../pointers/transformControlsModePtr"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"
import { flushMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { CommandRecord, UpdateCommand, pushUndoStack } from "../api/undoStack"
import getTransformControlsData from "../display/utils/getTransformControlsData"

type TransformControlsPhase = "start" | "end"
export type TransformControlsMode = "translate" | "rotate" | "scale"
export type TransformControlsPayload = {
    phase: TransformControlsPhase
    mode: TransformControlsMode
}
export const [emitTransformControls, onTransformControls] =
    event<TransformControlsPhase>()

onTransformControls((phase) => {
    const payload: TransformControlsPayload = {
        phase,
        mode: transformControlsModePtr[0]
    }
    for (const target of getAllSelectionTargets())
        target.$emitEvent("transformEdit", payload)

    updateSelectionManagersPhysics(payload)
})

let commandRecord: CommandRecord = {}
onTransformControls((phase) => {
    if (phase === "start") {
        flushMultipleSelectionTargets(() => {
            for (const target of getAllSelectionTargets()) {
                const data = getTransformControlsData(target)
                if (!data) continue
                commandRecord[target!.uuid] = {
                    command: "update",
                    commandPrev: data
                }
            }
        })
        return
    }
    flushMultipleSelectionTargets(() => {
        for (const target of getAllSelectionTargets()) {
            const data = getTransformControlsData(target)
            if (!data) continue
            ;(commandRecord[target!.uuid] as UpdateCommand).commandNext = data
        }
        pushUndoStack(commandRecord)
        commandRecord = {}
    })
})
