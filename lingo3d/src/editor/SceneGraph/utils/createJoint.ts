import MeshManager from "../../../display/core/MeshManager"
import Joint from "../../../display/Joint"
import { emitSelectionTarget } from "../../../events/onSelectionTarget"
import { flushMultipleSelectionTargets } from "../../../states/useMultipleSelectionTargets"

export default (name: string, manager0: MeshManager, manager1: MeshManager) =>
    flushMultipleSelectionTargets(() => {
        const joint = new Joint()
        if (name) joint.name = name
        joint.from = manager0.uuid
        joint.to = manager1.uuid
        emitSelectionTarget(joint)
    }, true)
