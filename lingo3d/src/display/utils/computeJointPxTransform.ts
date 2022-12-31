import {
    assignPxQuat,
    assignPxVec,
    setPxTransformPQ,
    setPxTransformPQ_
} from "../core/PhysicsObjectManager/physx/pxMath"
import PositionedManager from "../core/PositionedManager"
import { diffQuaternions } from "./quaternions"
import { vector3 } from "./reusables"

export default (joint: PositionedManager, manager: PositionedManager) =>
    setPxTransformPQ(
        assignPxVec(
            vector3
                .copy(joint.outerObject3d.position)
                .sub(manager.outerObject3d.position)
        ),
        assignPxQuat(
            diffQuaternions(
                joint.outerObject3d.quaternion,
                manager.outerObject3d.quaternion
            )
        )
    )

export const computeJointPxTransform_ = (
    joint: PositionedManager,
    manager: PositionedManager
) =>
    setPxTransformPQ_(
        assignPxVec(
            vector3
                .copy(joint.outerObject3d.position)
                .sub(manager.outerObject3d.position)
        ),
        assignPxQuat(
            diffQuaternions(
                joint.outerObject3d.quaternion,
                manager.outerObject3d.quaternion
            )
        )
    )
