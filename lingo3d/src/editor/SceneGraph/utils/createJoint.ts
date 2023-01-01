import MeshManager from "../../../display/core/MeshManager"
import Joint from "../../../display/Joint"

export default (manager0: MeshManager, manager1: MeshManager) => {
    const joint = new Joint()
    joint.from = manager0
    joint.to = manager1
}
