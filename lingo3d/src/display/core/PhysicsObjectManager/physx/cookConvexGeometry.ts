import { Object3D } from "three"
import Appendable from "../../../../api/core/Appendable"
import { getPhysX } from "../../../../states/usePhysX"
import {
    decreasePhysXCookingCount,
    increasePhysXCookingCount
} from "../../../../states/usePhysXCookingCount"
import destroy from "./destroy"
import computePxVertices from "./computePxVertices"

export const pxGeometryCache = new Map<string | undefined, any>()

export default (
    src: string | undefined,
    loaded: Object3D,
    manager: Appendable
) => {
    if (pxGeometryCache.has(src)) return pxGeometryCache.get(src)

    increasePhysXCookingCount()

    const {
        getConvexFlags,
        getCooking,
        getInsertionCallback,
        PxConvexMeshDesc,
        PxConvexMeshGeometry
    } = getPhysX()

    const [vec3Vector, count] = computePxVertices(loaded, manager)

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

    pxGeometryCache.set(src, pxGeometry)
    decreasePhysXCookingCount()

    return pxGeometry
}
