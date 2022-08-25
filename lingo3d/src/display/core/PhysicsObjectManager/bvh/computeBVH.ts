import { BufferGeometry } from "three"
import { MeshBVH } from "three-mesh-bvh"
import PhysicsObjectManager from ".."
import Primitive from "../../Primitive"
import { bvhManagerMap } from "./bvhManagerMap"

let bvhWorker = {
    generate: async (geom: BufferGeometry) => new MeshBVH(geom)
}
export const setBVHWorker = (worker: {
    generate: (geom: BufferGeometry) => Promise<MeshBVH>
}) => (bvhWorker = worker)

const bvhCache = new Map<string, Array<MeshBVH>>()

export const computeBVHFromGeometries = async (
    geometries: Array<BufferGeometry>,
    src?: string
) => {
    if (src && bvhCache.has(src)) return bvhCache.get(src)!

    const result: Array<MeshBVH> = []
    for (const geom of geometries) result.push(await bvhWorker.generate(geom))
    src && bvhCache.set(src, result)
    return result
}

export default async (item: PhysicsObjectManager, src?: string) => {
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
    const bvhArray = await computeBVHFromGeometries(geometries, src)
    for (const bvh of bvhArray) bvhManagerMap.set(bvh, item)
    return <const>[bvhArray, geometries]
}
