import { Object3D } from "three"
import { getPhysX } from "../../../../states/usePhysX"
import { pxGeometryCache } from "./getConvexGeometry"
import getMergedPxVertices from "./getMergedPxVertices"

export default (src: string | undefined, loaded: Object3D) => {
    if (pxGeometryCache.has(src)) return pxGeometryCache.get(src)

    const {
        PxBoundedData,
        Vector_PxU32,
        PxTriangleMeshDesc,
        cooking,
        insertionCallback,
        PxTriangleMeshGeometry
    } = getPhysX()

    const [pointVector, count, index] = getMergedPxVertices(src, loaded)
    const indexVector = new Vector_PxU32()

    const { array } = index
    for (let i = 0; i < index.count; i++) indexVector.push_back(array[i])

    const points = new PxBoundedData()
    points.count = count
    points.stride = 12
    points.data = pointVector.data()

    const triangles = new PxBoundedData()
    triangles.count = indexVector.size() / 3
    triangles.stride = 12
    triangles.data = indexVector.data()

    const desc = new PxTriangleMeshDesc()
    desc.points = points
    desc.triangles = triangles

    const triangleMesh = cooking.createTriangleMesh(desc, insertionCallback)
    const pxGeometry = new PxTriangleMeshGeometry(triangleMesh)

    // pointVector.destroy()
    // indexVector.destroy()

    pxGeometryCache.set(src, pxGeometry)
    return pxGeometry
}
