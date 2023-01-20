import {
    decreasePhysXCookingCount,
    increasePhysXCookingCount
} from "../../../../states/usePhysXCookingCount"
import destroy from "./destroy"
import computePxVertices from "./computePxVertices"
import createInstancePool from "../../utils/createInstancePool"
import getActualScale from "../../../utils/getActualScale"
import PhysicsObjectManager from ".."
import { physxPtr } from "./physxPtr"

type Params = [typeSrc: string, scaleX: number, scaleY: number, scaleZ: number]

export const primitiveGeometries = new WeakSet()

const primitiveGeometriesAdd = (target: any) => {
    primitiveGeometries.add(target)
    return target
}

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
    } = physxPtr[0]

    const [typeSrc, x, y, z] = params
    if (!manager || typeSrc === "cube")
        return primitiveGeometriesAdd(
            new PxBoxGeometry(x * 0.5, y * 0.5, z * 0.5)
        )
    if (typeSrc === "sphere" && x === y && x === z)
        return primitiveGeometriesAdd(new PxSphereGeometry(x * 0.5))

    increasePhysXCookingCount()

    const [vec3Vector, count] = computePxVertices(manager)
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
