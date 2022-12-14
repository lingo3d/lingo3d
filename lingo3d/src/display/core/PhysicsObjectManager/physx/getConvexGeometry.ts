import { Object3D } from "three"
import { getPhysX } from "../../../../states/usePhysX"
import getMergedPxVertices from "./getMergedPxVertices"

export const pxGeometryCache = new Map<string | undefined, any>()

export default (src: string | undefined, loaded: Object3D) => {
    if (pxGeometryCache.has(src)) return pxGeometryCache.get(src)

    const {
        convexFlags,
        cooking,
        insertionCallback,
        PxConvexMeshDesc,
        PxConvexMeshGeometry
    } = getPhysX()

    const [vec3Vector, count] = getMergedPxVertices(src, loaded)

    const desc = new PxConvexMeshDesc()
    desc.flags = convexFlags
    desc.points.count = count
    desc.points.stride = 12
    desc.points.data = vec3Vector.data()

    const convexMesh = cooking.createConvexMesh(desc, insertionCallback)
    const pxGeometry = new PxConvexMeshGeometry(convexMesh)

    pxGeometryCache.set(src, pxGeometry)
    return pxGeometry
}
