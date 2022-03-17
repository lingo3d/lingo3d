import { MeshBVH, MeshBVHVisualizer } from "three-mesh-bvh"
import { pullBVHMap, pushBVHMap } from "../../../../states/useBVHMap"
import { wireframeMaterial } from "../../../utils/reusables"
import { BufferGeometry, Mesh } from "three"
import scene from "../../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import PhysicsItem from "."

export default function (this: PhysicsItem, handle: Cancellable, debug: boolean) {
    const geometries: Array<BufferGeometry> = []
    this.outerObject3d.updateMatrixWorld(true)

    this.outerObject3d.traverse((c: any) => {
        if (!c.geometry || c === this.object3d) return
        const geom = c.geometry.clone()
        geom.applyMatrix4(c.matrixWorld)
        geometries.push(geom)
        geom.dispose()
    })

    for (const geom of geometries)
        pushBVHMap(geom.boundsTree = new MeshBVH(geom))

    handle.then(() => {
        for (const geom of geometries)
            pullBVHMap(geom.boundsTree!)
    })

    if (debug)
        for (const geom of geometries) {
            const visualizer = new MeshBVHVisualizer(new Mesh(geom, wireframeMaterial), 20)
            scene.add(visualizer)

            handle.then(() => {
                scene.remove(visualizer)
            })
        }
}