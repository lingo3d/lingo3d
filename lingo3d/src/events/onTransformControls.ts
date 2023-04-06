import { event } from "@lincode/events"
import { filterBoolean } from "@lincode/utils"
import { getEditorMode } from "../states/useEditorMode"
import { getMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { addUpdatePhysicsSystem } from "../systems/configSystems/updatePhysicsSystem"
import { pxUpdateShapeSet } from "../collections/pxUpdateShapeSet"
import MeshAppendable from "../api/core/MeshAppendable"
import Appendable from "../api/core/Appendable"

export type TransformControlsPhase = "start" | "end" | "move"
export type TransformControlsMode = "translate" | "rotate" | "scale"

export const [emitTransformControls, onTransformControls] =
    event<TransformControlsPhase>()

onTransformControls((phase) => {
    if (phase !== "end") return

    const [multipleSelectionTargets] = getMultipleSelectionTargets()
    const targets: Array<MeshAppendable | Appendable> = [
        ...multipleSelectionTargets,
        getSelectionTarget()
    ].filter(filterBoolean)

    if (getEditorMode() === "scale") {
        for (const target of targets) {
            if (!("object3d" in target)) continue
            pxUpdateShapeSet.add(target)
            addUpdatePhysicsSystem(target)
        }
        return
    }
    for (const target of targets)
        "object3d" in target && addUpdatePhysicsSystem(target)
})
