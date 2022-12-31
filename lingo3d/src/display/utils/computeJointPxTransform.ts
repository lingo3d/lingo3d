import {
    setPxTransform,
    setPxTransform_
} from "../core/PhysicsObjectManager/physx/pxMath"
import PositionedManager from "../core/PositionedManager"
import { vector3 } from "./reusables"

export default (joint: PositionedManager, manager: PositionedManager) => {
    const { x, y, z } = vector3
        .copy(joint.outerObject3d.position)
        .sub(manager.outerObject3d.position)

    return setPxTransform(x, y, z)
}

export const computeJointPxTransform_ = (
    joint: PositionedManager,
    manager: PositionedManager
) => {
    const { x, y, z } = vector3
        .copy(joint.outerObject3d.position)
        .sub(manager.outerObject3d.position)

    return setPxTransform_(x, y, z)
}
