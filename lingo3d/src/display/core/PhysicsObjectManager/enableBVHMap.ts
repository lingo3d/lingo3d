import { pullBVHMap, pushBVHMap } from "../../../states/useBVHMap"
import { wireframeMaterial } from "../../utils/reusables"
import { Mesh } from "three"
import scene from "../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import computeBVH from "./bvh/computeBVH"
import PhysicsObjectManager from "."
import { MeshBVHVisualizer } from "three-mesh-bvh"
import Loaded from "../Loaded"

export default async function (
    this: PhysicsObjectManager | Loaded,
    handle: Cancellable,
    debug: boolean
) {
    if (handle.done) return

    const [bvhMaps, geometries] = await computeBVH(this)

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
