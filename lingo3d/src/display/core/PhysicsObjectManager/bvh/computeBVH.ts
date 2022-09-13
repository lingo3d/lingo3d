import { BufferGeometry, Mesh } from "three"
import { MeshBVH } from "three-mesh-bvh"
import PhysicsObjectManager from ".."
import Primitive from "../../Primitive"
import { bvhManagerMap } from "./bvhManagerMap"
import { acceleratedRaycast } from "./ExtensionUtilities"
import { GenerateMeshBVHWorker, geometryMeshMap } from "./GenerateMeshBVHWorker"

Mesh.prototype.raycast = acceleratedRaycast

const bvhWorker = new GenerateMeshBVHWorker()

const computeBVHFromGeometries = async (geometries: Array<BufferGeometry>) => {
    const result: Array<MeshBVH> = []
    for (const geom of geometries)
        result.push((geom.boundsTree = await bvhWorker.generate(geom)))

    return result
}

export default async (item: PhysicsObjectManager) => {
    item.outerObject3d.updateMatrixWorld(true)

    const geometries: Array<BufferGeometry> = []
    item.outerObject3d.traverse((c: any) => {
        if (
            !c.geometry ||
            (c === item.nativeObject3d && !(item instanceof Primitive))
        )
            return

        geometries.push(c.geometry)
        geometryMeshMap.set(c.geometry, c)
    })
    const bvhArray = await computeBVHFromGeometries(geometries)
    for (const bvh of bvhArray) bvhManagerMap.set(bvh, item)

    return <const>[bvhArray, geometries]
}
