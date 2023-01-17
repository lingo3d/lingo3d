import { physXPtr } from "../../../../states/usePhysX"
import {
    decreasePhysXCookingCount,
    increasePhysXCookingCount
} from "../../../../states/usePhysXCookingCount"
import destroy from "./destroy"
import computePxVertices from "./computePxVertices"
import createInstancePool from "../../utils/createInstancePool"
import getActualScale from "../../../utils/getActualScale"
import PhysicsObjectManager from ".."

type Params = [typeSrc: string, scaleX: number, scaleY: number, scaleZ: number]

const [increaseCount, decreaseCount] = createInstancePool<
    PhysicsObjectManager,
    Params
>((_, params, manager) => {
    const {
        getConvexFlags,
        getCooking,
        getInsertionCallback,
        PxConvexMeshDesc,
        PxConvexMeshGeometry,
        PxSphereGeometry,
        PxBoxGeometry
    } = physXPtr[0]

    const [typeSrc, x, y, z] = params
    if (
        !manager ||
        ((typeSrc === "cube" || typeSrc === "sphere") && x === y && x === z)
    )
        return typeSrc === "sphere"
            ? new PxSphereGeometry(x)
            : new PxBoxGeometry(x, y, z)

    increasePhysXCookingCount()

    const [vec3Vector, count] = computePxVertices(
        "loadedObject3d" in manager
            ? manager.loadedObject3d!
            : manager.object3d,
        manager
    )
    const desc = new PxConvexMeshDesc()
    desc.flags = getConvexFlags()
    desc.points.count = count
    desc.points.stride = 12
    desc.points.data = vec3Vector.data()

    const convexMesh = getCooking().createConvexMesh(
        desc,
        getInsertionCallback()
    )
    const pxGeometry = new PxConvexMeshGeometry(convexMesh)

    destroy(desc)
    vec3Vector.clear()
    destroy(vec3Vector)

    decreasePhysXCookingCount()

    return pxGeometry
}, destroy)

export default (typeSrc: string, manager: PhysicsObjectManager) => {
    const { x, y, z } = getActualScale(manager)
    const params: Params = [typeSrc, x, y, z]
    const paramString = JSON.stringify(params)
    decreaseConvexGeometryCount(manager)
    return increaseCount(
        PhysicsObjectManager,
        params,
        (manager.convexParamString = paramString),
        manager
    )
}

export const decreaseConvexGeometryCount = (manager: PhysicsObjectManager) =>
    manager.convexParamString &&
    decreaseCount(PhysicsObjectManager, manager.convexParamString)
