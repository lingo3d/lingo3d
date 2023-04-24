import { event } from "@lincode/events"
import { filterBoolean } from "@lincode/utils"
import { getEditorMode } from "../states/useEditorMode"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { addConfigPhysicsSystem } from "../systems/configLoadedSystems/configPhysicsSystem"
import MeshAppendable from "../api/core/MeshAppendable"
import Appendable from "../api/core/Appendable"
import { selectionTargetPtr } from "../pointers/selectionTargetPtr"

type TransformControlsPhase = "start" | "end" | "move"
type TransformControlsMode = "translate" | "rotate" | "scale"
export type TransformControlsPayload = {
    phase: TransformControlsPhase
    mode: TransformControlsMode
}

export const [emitTransformControls, onTransformControls] =
    event<TransformControlsPhase>()

onTransformControls((phase) => {
    if (phase !== "end") return

    const [multipleSelectionTargets] = getMultipleSelectionTargets()
    const targets: Array<MeshAppendable | Appendable> = [
        ...multipleSelectionTargets,
        selectionTargetPtr[0]
    ].filter(filterBoolean)

    if (getEditorMode() === "scale") {
        for (const target of targets) {
            if (!("object3d" in target)) continue
            target.userData.physicsMode = undefined
            addConfigPhysicsSystem(target)
        }
        return
    }
    for (const target of targets)
        "object3d" in target && addConfigPhysicsSystem(target)
})
