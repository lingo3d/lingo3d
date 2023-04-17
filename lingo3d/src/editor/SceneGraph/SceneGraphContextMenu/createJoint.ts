import MeshAppendable from "../../../api/core/MeshAppendable"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"
import createObject from "../../../api/serializer/createObject"
import JointBase from "../../../display/core/JointBase"
import { centroid3d } from "@lincode/math"

export default (
    type:
        | "fixedJoint"
        | "sphericalJoint"
        | "revoluteJoint"
        | "prismaticJoint"
        | "d6Joint"
) =>
    flushMultipleSelectionTargets((managers) => {
        let fromManager: MeshAppendable | undefined
        let joint: JointBase | undefined
        for (const toManager of managers) {
            if (fromManager) {
                joint = createObject(type)
                joint.from = fromManager.uuid
                joint.to = toManager.uuid
                Object.assign(joint, centroid3d([fromManager, toManager]))
            }
            fromManager = toManager
        }
        emitSelectionTarget(joint)
    }, true)
