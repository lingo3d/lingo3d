import MeshManager from "../../../display/core/MeshManager"
import Joint from "../../../display/Joint"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"

export default () =>
    flushMultipleSelectionTargets((managers) => {
        let managerOld: MeshManager | undefined
        let joint: Joint | undefined
        for (const manager of managers) {
            if (managerOld) {
                joint = new Joint()
                joint.from = manager.uuid
                joint.to = managerOld.uuid
            }
            managerOld = manager
        }
        emitSelectionTarget(joint)
    }, true)
