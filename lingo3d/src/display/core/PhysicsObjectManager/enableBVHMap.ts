import { pullBVHMap, pushBVHMap } from "../../../states/useBVHMap"
import { wireframeMaterial } from "../../utils/reusables"
import { BufferGeometry, Mesh } from "three"
import scene from "../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import computeBVH from "./bvh/computeBVH"
import PhysicsObjectManager from "."
import { MeshBVH, MeshBVHVisualizer } from "three-mesh-bvh"
import Loaded from "../Loaded"

const cache = new Map<string, [Array<MeshBVH>, Array<BufferGeometry>]>()

export default async function (
    this: PhysicsObjectManager | Loaded,
    handle: Cancellable,
    debug: boolean
) {
    if (handle.done) return

    let bvhMaps: Array<MeshBVH>
    let geometries: Array<BufferGeometry>
    if ("src" in this && this.src && cache.has(this.src))
        [bvhMaps, geometries] = cache.get(this.src)!
    else {
        ;[bvhMaps, geometries] = await computeBVH(this)
        "src" in this && this.src && cache.set(this.src, [bvhMaps, geometries])
    }

    for (const bvhMap of bvhMaps) pushBVHMap(bvhMap)

    handle.then(() => {
        for (const bvhMap of bvhMaps) pullBVHMap(bvhMap)
    })

    if (debug)
        for (const geom of geometries) {
            const visualizer = new MeshBVHVisualizer(
                new Mesh(geom, wireframeMaterial),
                20
            )
            scene.add(visualizer)
            handle.then(() => scene.remove(visualizer))
        }
}
