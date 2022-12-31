import MeshManager from "../core/MeshManager"
import { assignPxTransformFromVector } from "../core/PhysicsObjectManager/physx/pxMath"
import PositionedManager from "../core/PositionedManager"
import { vector3, quaternion } from "./reusables"

export default (joint: PositionedManager, manager: MeshManager) =>
    assignPxTransformFromVector(
        vector3
            .copy(joint.outerObject3d.position)
            .sub(manager.outerObject3d.position),
        quaternion.copy(manager.outerObject3d.quaternion).invert()
    )
