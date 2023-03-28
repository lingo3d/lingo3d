import getActualScale from "../../../utils/getActualScale"
import PhysicsObjectManager from ".."
import {
    decreasePhysxConvexGeometry,
    increasePhysxConvexGeometry,
    PhysxConvexGeometryParams
} from "../../../../pools/physxConvexGeometryPool"

export default (typeSrc: string, manager: PhysicsObjectManager) => {
    const { x, y, z } = getActualScale(manager)
    const params: PhysxConvexGeometryParams = [typeSrc, x, y, z]
    const paramString = JSON.stringify(params)
    decreaseConvexGeometryCount(manager)
    return increasePhysxConvexGeometry(
        params,
        (manager.convexParamString = paramString),
        manager
    )
}

export const decreaseConvexGeometryCount = (manager: PhysicsObjectManager) =>
    manager.convexParamString &&
    decreasePhysxConvexGeometry(manager.convexParamString)
