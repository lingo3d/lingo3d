import {
    assignPxQuat,
    assignPxVec,
    setPxTransformPQ
} from "../core/PhysicsObjectManager/physx/pxMath"
import PositionedManager from "../core/PositionedManager"
import { vector3, quaternion } from "./reusables"

export default (joint: PositionedManager, manager: PositionedManager) =>
    setPxTransformPQ(
        assignPxVec(
            vector3
                .copy(joint.outerObject3d.position)
                .sub(manager.outerObject3d.position)
        ),
        assignPxQuat(quaternion.copy(manager.outerObject3d.quaternion).invert())
    )
