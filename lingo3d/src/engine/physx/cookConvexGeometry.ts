import getActualScale from "../../memo/getActualScale"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import {
    releasePhysxConvexGeometry,
    requestPhysxConvexGeometry,
    PhysxConvexGeometryParams
} from "../../pools/physxConvexGeometryPool"

export default (typeSrc: string, manager: PhysicsObjectManager) => {
    const { x, y, z } = getActualScale(manager)
    const params: PhysxConvexGeometryParams = [typeSrc, x, y, z]
    const paramString = JSON.stringify(params)
    decreaseConvexGeometryCount(manager)
    return requestPhysxConvexGeometry(
        params,
        (manager.$convexParamString = paramString),
        manager
    )
}

export const decreaseConvexGeometryCount = (manager: PhysicsObjectManager) =>
    manager.$convexParamString &&
    releasePhysxConvexGeometry(manager.$convexParamString)
