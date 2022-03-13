import { MeshBVH, MeshBVHVisualizer } from "three-mesh-bvh"
import { setBVH } from "../../../../states/useBVH"
import { wireframeMaterial } from "../../../utils/reusables"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import { BufferGeometry, Mesh } from "three"
import scene from "../../../../engine/scene"
import { Cancellable } from "@lincode/promiselikes"
import PhysicsItem from "."

export default function (this: PhysicsItem, handle: Cancellable, debug: boolean) {
    const geometries: Array<BufferGeometry> = []
    this.outerObject3d.updateMatrixWorld(true)

    this.outerObject3d.traverse((c: any) => {
        if (!c.geometry || c === this.object3d) return
        const cloned = c.geometry.clone()
        cloned.applyMatrix4(c.matrixWorld)
        for (const key in cloned.attributes)
            key !== "position" && cloned.deleteAttribute(key)

        geometries.push(cloned)
    })

    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false)
    mergedGeometry.dispose()
    const collider = new Mesh(mergedGeometry, wireframeMaterial)

    const boundsTree = mergedGeometry.boundsTree = new MeshBVH(mergedGeometry)
    setBVH([boundsTree, collider])

    if (debug) {
        const visualizer = new MeshBVHVisualizer(collider, 20)
        scene.add(visualizer)

        handle.then(() => {
            scene.remove(visualizer)
        })
    }
}