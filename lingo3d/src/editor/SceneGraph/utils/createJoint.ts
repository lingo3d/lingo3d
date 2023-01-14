import MeshAppendable from "../../../api/core/MeshAppendable"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"
import createObject from "../../../api/serializer/createObject"
import JointBase from "../../../display/core/JointBase"

export default (
    type:
        | "fixedJoint"
        | "distanceJoint"
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
            }
            fromManager = toManager
        }
        emitSelectionTarget(joint)
    }, true)
