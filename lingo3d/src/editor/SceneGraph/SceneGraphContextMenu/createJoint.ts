import MeshAppendable from "../../../display/core/MeshAppendable"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"
import createObject from "../../../api/serializer/createObject"
import JointBase from "../../../display/core/JointBase"
import { multipleSelectionTargets } from "../../../collections/multipleSelectionTargets"
import average3d from "../../../math/average3d"

export default (
    type:
        | "fixedJoint"
        | "sphericalJoint"
        | "revoluteJoint"
        | "prismaticJoint"
        | "d6Joint"
) =>
    flushMultipleSelectionTargets(() => {
        let fromManager: MeshAppendable | undefined
        let joint: JointBase | undefined
        for (const toManager of multipleSelectionTargets) {
            if (fromManager) {
                joint = createObject(type)
                joint.from = fromManager.uuid
                joint.to = toManager.uuid
                Object.assign(joint, average3d(fromManager, toManager))
            }
            fromManager = toManager
        }
        emitSelectionTarget(joint)
    }, true)
