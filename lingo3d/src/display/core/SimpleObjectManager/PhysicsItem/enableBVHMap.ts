import { MeshBVH, MeshBVHVisualizer } from "three-mesh-bvh"
import { pullBVHMap, pushBVHMap } from "../../../../states/useBVHMap"
import { wireframeMaterial } from "../../../utils/reusables"
import { BufferGeometry, Mesh } from "three"
import scene from "../../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import PhysicsItem from "."
//@ts-ignore
import { GenerateMeshBVHWorker } from "../PhysicsItem/bvh/GenerateMeshBVHWorker"

const bvhGenerationWorker = new GenerateMeshBVHWorker()

export default async function (this: PhysicsItem, handle: Cancellable, debug: boolean) {
    if (handle.done) return
    
    scene.attach(this.outerObject3d)

    const geometries: Array<BufferGeometry> = []
    this.outerObject3d.updateMatrixWorld(true)

    this.outerObject3d.traverse((c: any) => {
        if (!c.geometry || c === this.object3d) return
        const geom = c.geometry.clone()
        geom.applyMatrix4(c.matrixWorld)
        geometries.push(geom)
        geom.dispose()
    })

    const bvhMaps: Array<MeshBVH> = []

    for (const geom of geometries)
        await new Promise<void>(resolve => {
            bvhGenerationWorker.generate(geom).then((bvh: MeshBVH) => {
                bvhMaps.push(geom.boundsTree = bvh)
                resolve()
            })
        })

    for (const bvhMap of bvhMaps)
        pushBVHMap(bvhMap)

    handle.then(() => {
        for (const bvhMap of bvhMaps)
            pullBVHMap(bvhMap)
    })

    if (debug)
        for (const geom of geometries) {
            const visualizer = new MeshBVHVisualizer(new Mesh(geom, wireframeMaterial), 20)
            scene.add(visualizer)
            handle.then(() => scene.remove(visualizer))
        }
}