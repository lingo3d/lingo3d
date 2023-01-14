import MeshAppendable from "../../../api/core/MeshAppendable"
import SphericalJoint from "../../../display/SphericalJoint"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"

export default () =>
    flushMultipleSelectionTargets((managers) => {
        let managerOld: MeshAppendable | undefined
        let joint: SphericalJoint | undefined
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
