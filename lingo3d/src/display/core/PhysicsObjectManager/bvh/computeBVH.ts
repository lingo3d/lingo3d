import { BufferGeometry, Mesh } from "three"
import { MeshBVH } from "three-mesh-bvh"
import PhysicsObjectManager from ".."
import {
    decreaseBVHComputing,
    increaseBVHComputing
} from "../../../../states/useBVHComputingCount"
import Primitive from "../../Primitive"
import { bvhManagerMap } from "./bvhManagerMap"
import { acceleratedRaycast } from "./ExtensionUtilities"
import { GenerateMeshBVHWorker, geometryMeshMap } from "./GenerateMeshBVHWorker"

Mesh.prototype.raycast = acceleratedRaycast

// const bvhWorker = new GenerateMeshBVHWorker()

const bvhWorker = {
    generate: async (geom: BufferGeometry) => {
        const geometry = geom.clone()
        geometry.applyMatrix4(geometryMeshMap.get(geom).matrixWorld)
        return new MeshBVH(geometry)
    }
}

console.log("synchronous collision generation")

const computeBVHFromGeometries = async (geometries: Array<BufferGeometry>) => {
    const result: Array<MeshBVH> = []
    for (const geom of geometries)
        result.push((geom.boundsTree = await bvhWorker.generate(geom)))

    return result
}

export default async (item: PhysicsObjectManager) => {
    increaseBVHComputing()
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

    decreaseBVHComputing()
    return <const>[bvhArray, geometries]
}
