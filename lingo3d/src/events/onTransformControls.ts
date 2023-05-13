import { event } from "@lincode/events"
import { transformControlsModePtr } from "../pointers/transformControlsModePtr"
import getAllSelectionTargets from "../throttle/getAllSelectionTargets"
import updateSelectionManagersPhysics from "../display/utils/updateSelectionManagersPhysics"

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
