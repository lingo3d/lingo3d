import MeshAppendable from "../../../api/core/MeshAppendable"
import SphericalJoint from "../../../display/joints/SphericalJoint"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"
import createObject from "../../../api/serializer/createObject"

export default (type: "fixedJoint" | "sphericalJoint") =>
    flushMultipleSelectionTargets((managers) => {
        let managerOld: MeshAppendable | undefined
        let joint = createObject(type)
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
