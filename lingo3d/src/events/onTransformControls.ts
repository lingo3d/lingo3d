import { event } from "@lincode/events"
import { filterBoolean } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import { getEditorMode } from "../states/useEditorMode"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { addUpdatePhysicsSystem } from "../systems/configSystems/updatePhysicsSystem"

export type TransformControlsPhase = "start" | "end" | "move"
export type TransformControlsMode = "translate" | "rotate" | "scale"

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
            if (!("object3d" in target)) continue
            target.userData.updatePhysicsShape = true
            addUpdatePhysicsSystem(target)
        }
        return
    }
    for (const target of targets)
        "object3d" in target && addUpdatePhysicsSystem(target)
})
