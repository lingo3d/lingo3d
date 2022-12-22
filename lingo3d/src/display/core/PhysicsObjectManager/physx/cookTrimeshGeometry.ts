import { Object3D } from "three"
import { getPhysX } from "../../../../states/usePhysX"
import {
    decreasePhysXCookingCount,
    increasePhysXCookingCount
} from "../../../../states/usePhysXCookingCount"
import destroy from "./destroy"
import { pxGeometryCache } from "./cookConvexGeometry"
import computeMergedPxVertices from "./computeMergedPxVertices"
import MeshAppendable from "../../../../api/core/MeshAppendable"

export default (
    src: string | undefined,
    loaded: Object3D,
    manager: MeshAppendable
) => {
    if (pxGeometryCache.has(src)) return pxGeometryCache.get(src)

    increasePhysXCookingCount()

    const {
        PxBoundedData,
        Vector_PxU32,
        PxTriangleMeshDesc,
        getCooking,
        getInsertionCallback,
        PxTriangleMeshGeometry
    } = getPhysX()

    const [pointVector, count, index] = computeMergedPxVertices(loaded, manager)
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
    decreasePhysXCookingCount()

    return pxGeometry
}
