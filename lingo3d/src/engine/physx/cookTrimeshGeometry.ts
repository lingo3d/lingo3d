import computeMergedPxVertices from "./computeMergedPxVertices"
import { physxPtr } from "../../pointers/physxPtr"
import cookConvexGeometry from "./cookConvexGeometry"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { busyCountPtr } from "../../pointers/busyCountPtr"
import { busyPhysicsPtr } from "../../pointers/busyPhysicsPtr"

const pxGeometryCache = new Map<string, any>()

export default (src: string, manager: PhysicsObjectManager) => {
    if (pxGeometryCache.has(src)) return pxGeometryCache.get(src)

    const {
        PxBoundedData,
        Vector_PxU32,
        PxTriangleMeshDesc,
        getCooking,
        getInsertionCallback,
        PxTriangleMeshGeometry,
        destroy
    } = physxPtr[0]

    busyCountPtr[0]++
    busyPhysicsPtr[0]++
    const [pointVector, count, index] = computeMergedPxVertices(manager)
    if (!index) {
        pointVector.clear()
        destroy(pointVector)
        busyCountPtr[0]--
        busyPhysicsPtr[0]--
        return cookConvexGeometry(src, manager)
    }

    const { array } = index
    const indexVector = new Vector_PxU32()
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

    const triangleMesh = getCooking().createTriangleMesh(
        desc,
        getInsertionCallback()
    )
    const pxGeometry = new PxTriangleMeshGeometry(triangleMesh)

    pointVector.clear()
    destroy(pointVector)
    indexVector.clear()
    destroy(indexVector)
    destroy(points)
    destroy(triangles)
    destroy(desc)

    pxGeometryCache.set(src, pxGeometry)

    busyCountPtr[0]--
    busyPhysicsPtr[0]--
    return pxGeometry
}
