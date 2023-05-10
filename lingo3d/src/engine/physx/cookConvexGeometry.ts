import getActualScale from "../../memo/getActualScale"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import {
    releasePhysxConvexGeometry,
    requestPhysxConvexGeometry
} from "../../pools/physxConvexGeometryPool"

export default (typeSrc: string, manager: PhysicsObjectManager) => {
    const { x, y, z } = getActualScale(manager)
    decreaseConvexGeometryCount(manager)
    const result = requestPhysxConvexGeometry([typeSrc, x, y, z], manager)
    manager.$convexGeometry = result
    return result
}

export const decreaseConvexGeometryCount = (manager: PhysicsObjectManager) =>
    manager.$convexGeometry &&
    releasePhysxConvexGeometry(manager.$convexGeometry)
