import MeshAppendable from "../../../api/core/MeshAppendable"
import JointBase from "../../../display/core/JointBase"
import SphericalJoint from "../../../display/joints/SphericalJoint"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"

export default () =>
    flushMultipleSelectionTargets((managers) => {
        let managerOld: MeshAppendable | undefined
        let joint: JointBase | undefined
        for (const manager of managers) {
            if (managerOld) {
                joint = new SphericalJoint()
                joint.from = manager.uuid
                joint.to = managerOld.uuid
            }
            managerOld = manager
        }
        emitSelectionTarget(joint)
    }, true)
