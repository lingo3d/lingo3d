import { BufferGeometry } from "three"
import PhysicsItem from ".."
import Primitive from "../../../Primitive"
import { MeshBVH } from "./bvh"
// import { GenerateMeshBVHWorker } from "./GenerateMeshBVHWorker"

export const bvhManagerMap = new WeakMap<any, PhysicsItem>()

// const bvhWorker = new GenerateMeshBVHWorker()

export default (item: PhysicsItem): [Array<MeshBVH>, Array<BufferGeometry>] => {
    item.outerObject3d.updateMatrixWorld(true)

    const geometries: Array<BufferGeometry> = []
    item.outerObject3d.traverse((c: any) => {
        if (!c.geometry || (c === item.object3d && !(item instanceof Primitive)))
            return
            
        const geom = c.geometry.clone()
        geom.applyMatrix4(c.matrixWorld)
        geometries.push(geom)
        geom.dispose()
    })

    const bvhComputed: Array<MeshBVH> = []
    for (const geom of geometries) {
        //@ts-ignore
        // const bvh = geom.boundsTree = await bvhWorker.generate(geom)
        //@ts-ignore
        const bvh = geom.boundsTree = new MeshBVH(geom)
        bvhComputed.push(bvh)
        bvhManagerMap.set(bvh, item)
    }
    return [bvhComputed, geometries]
}