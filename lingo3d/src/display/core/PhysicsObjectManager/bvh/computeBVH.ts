import { BufferGeometry, Mesh } from "three"
import { MeshBVH } from "three-mesh-bvh"
import PhysicsObjectManager from ".."
import {
    decreaseBVHComputing,
    increaseBVHComputing
} from "../../../../states/useBVHComputingCount"
import unsafeGetValue from "../../../../utils/unsafeGetValue"
import Reflector from "../../../Reflector"
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
    item.outerObject3d.traverse((c) => {
        const childGeom = unsafeGetValue(c, "geometry")
        if (
            !childGeom ||
            (c === item.nativeObject3d &&
                !(item instanceof Primitive) &&
                !(item instanceof Reflector))
        )
            return

        geometries.push(childGeom)
        geometryMeshMap.set(childGeom, c)
    })
    const bvhArray = await computeBVHFromGeometries(geometries)
    for (const bvh of bvhArray) bvhManagerMap.set(bvh, item)

    decreaseBVHComputing()
    return <const>[bvhArray, geometries]
}
