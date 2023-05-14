import { event } from "@lincode/events"
import { transformControlsModePtr } from "../pointers/transformControlsModePtr"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"
import { flushMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { CommandRecord, UpdateCommand, pushUndoStack } from "../api/undoStack"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import MeshAppendable from "../api/core/MeshAppendable"
import Appendable from "../api/core/Appendable"

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

const getUndoData = (target: Appendable | undefined) => {
    if (!(target instanceof MeshAppendable)) return
    const [mode] = transformControlsModePtr
    if (mode === "scale" && target instanceof SimpleObjectManager)
        return {
            scaleX: target.scaleX,
            scaleY: target.scaleY,
            scaleZ: target.scaleZ
        }
    else if (mode === "rotate")
        return {
            rotationX: target.rotationX,
            rotationY: target.rotationY,
            rotationZ: target.rotationZ
        }
    else if (mode === "translate")
        return {
            x: target.x,
            y: target.y,
            z: target.z
        }
}

let record: CommandRecord = {}
onTransformControls((phase) => {
    if (phase === "start") {
        flushMultipleSelectionTargets((targets) => {
            for (const target of [...targets, selectionTargetPtr[0]]) {
                const data = getUndoData(target)
                if (!data) continue
                record[target!.uuid] = { command: "update", prev: data }
            }
        })
        return
    }
    flushMultipleSelectionTargets((targets) => {
        for (const target of [...targets, selectionTargetPtr[0]]) {
            const data = getUndoData(target)
            if (!data) continue
            ;(record[target!.uuid] as UpdateCommand).next = data
        }
        pushUndoStack(record)
        record = {}
    })
})
