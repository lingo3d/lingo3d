import { BufferGeometry } from "three"
import { MeshBVH } from "three-mesh-bvh"
import PhysicsObjectManager from ".."
import Primitive from "../../Primitive"
import { bvhManagerMap } from "./bvhManagerMap"
import { GenerateMeshBVHWorker } from "./GenerateMeshBVHWorker"

const bvhWorker = new GenerateMeshBVHWorker()

export const computeBVHFromGeometries = async (
    geometries: Array<BufferGeometry>
) => {
    const result: Array<MeshBVH> = []
    for (const geom of geometries) result.push(await bvhWorker.generate(geom))

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

        const geom = c.geometry.clone()
        geom.applyMatrix4(c.matrixWorld)
        geometries.push(geom)
        geom.dispose()
    })
    const bvhArray = await computeBVHFromGeometries(geometries)
    for (const bvh of bvhArray) bvhManagerMap.set(bvh, item)
    return <const>[bvhArray, geometries]
}
