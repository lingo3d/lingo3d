import getActualScale from "../../memo/getActualScale"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { physxConvexGeometryPool } from "../../pools/physxConvexGeometryPool"

export default (typeSrc: string, manager: PhysicsObjectManager) => {
    const { x, y, z } = getActualScale(manager)
    decreaseConvexGeometryCount(manager)
    const result = physxConvexGeometryPool.request(
        [typeSrc, x, y, z],
        undefined,
        manager
    )
    manager.$convexGeometry = result
    return result
}

export const decreaseConvexGeometryCount = (manager: PhysicsObjectManager) =>
    manager.$convexGeometry &&
    physxConvexGeometryPool.release(manager.$convexGeometry)
