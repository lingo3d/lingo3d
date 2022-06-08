import { BufferGeometry } from "three"
import PhysicsMixin from ".."
import { getObject3d } from "../../../MeshItem"
import Primitive from "../../../Primitive"
import { MeshBVH } from "./bvh"
// import { GenerateMeshBVHWorker } from "./GenerateMeshBVHWorker"

export const bvhManagerMap = new WeakMap<any, PhysicsMixin>()

// const bvhWorker = new GenerateMeshBVHWorker()

export default (item: PhysicsMixin): [Array<MeshBVH>, Array<BufferGeometry>] => {
    item.outerObject3d.updateMatrixWorld(true)

    const geometries: Array<BufferGeometry> = []
    item.outerObject3d.traverse((c: any) => {
        if (!c.geometry || (c === getObject3d(item) && !(item instanceof Primitive)))
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