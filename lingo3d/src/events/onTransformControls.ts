import { event } from "@lincode/events"
import { transformControlsModePtr } from "../pointers/transformControlsModePtr"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"
import { flushMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { CommandRecord, UpdateCommand, pushUndoStack } from "../api/undoStack"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import MeshAppendable from "../display/core/MeshAppendable"
import Appendable from "../display/core/Appendable"

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

let commandRecord: CommandRecord = {}
onTransformControls((phase) => {
    if (phase === "start") {
        flushMultipleSelectionTargets(() => {
            for (const target of getAllSelectionTargets()) {
                const data = getUndoData(target)
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
            const data = getUndoData(target)
            if (!data) continue
            ;(commandRecord[target!.uuid] as UpdateCommand).commandNext = data
        }
        pushUndoStack(commandRecord)
        commandRecord = {}
    })
})
