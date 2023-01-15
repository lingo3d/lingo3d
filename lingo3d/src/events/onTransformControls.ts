import { event } from "@lincode/events"
import { filterBoolean } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import { getEditorMode } from "../states/useEditorMode"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"

export type TransformControlsPhase = "start" | "end" | "move"

export const [emitTransformControls, onTransformControls] =
    event<TransformControlsPhase>()

onTransformControls((phase) => {
    if (phase !== "end") return

    const [_targets] = getMultipleSelectionTargets()
    const targets: Array<Appendable | PhysicsObjectManager> = [
        ..._targets,
        getSelectionTarget()
    ].filter(filterBoolean)

    if (getEditorMode() === "scale") {
        for (const target of targets) {
            if (!("updatePhysics" in target)) continue
            target.updatePhysics()
            target.updatePhysicsShape()
        }
        return
    }
    for (const target of targets)
        "updatePhysics" in target && target.updatePhysics()
})
