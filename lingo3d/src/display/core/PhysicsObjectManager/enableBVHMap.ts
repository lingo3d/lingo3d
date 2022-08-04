import { MeshBVHVisualizer } from "./bvh/bvh"
import { pullBVHMap, pushBVHMap } from "../../../states/useBVHMap"
import { wireframeMaterial } from "../../utils/reusables"
import { Mesh } from "three"
import scene from "../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import computeBVH from "./bvh/computeBVH"
import PhysicsObjectManager from "."

export default async function (
    this: PhysicsObjectManager,
    handle: Cancellable,
    debug: boolean
) {
    if (handle.done) return

    const [bvhMaps, geometries] = computeBVH(this)

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
            //@ts-ignore
            scene.add(visualizer)
            //@ts-ignore
            handle.then(() => scene.remove(visualizer))
        }
}
