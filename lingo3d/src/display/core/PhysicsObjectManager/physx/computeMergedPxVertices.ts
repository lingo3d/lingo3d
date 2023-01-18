import { Object3D, BufferGeometry, Mesh } from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import { physXPtr } from "./physxPtr"

export default (loaded: Object3D, manager: MeshAppendable) => {
    const { Vector_PxVec3 } = physXPtr[0]

    const geometries: Array<BufferGeometry> = []

    loaded.updateMatrixWorld()
    const { x, y, z } = manager.position
    loaded.traverse((c: Object3D | Mesh) => {
        if (!("geometry" in c)) return
        const clone = c.geometry.clone()
        clone.applyMatrix4(c.matrixWorld)
        clone.translate(-x, -y, -z)
        clone.deleteAttribute("uv2")
        clone.dispose()
        geometries.push(clone)
    })
    const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
    geometry.dispose()

    const buffer = geometry.attributes.position
    const vertices = buffer.array

    const vec3Vector = new Vector_PxVec3(buffer.count)
    for (let i = 0; i < buffer.count; i++) {
        const pxVec3 = vec3Vector.at(i)
        const offset = i * 3
        pxVec3.set_x(vertices[offset])
        pxVec3.set_y(vertices[offset + 1])
        pxVec3.set_z(vertices[offset + 2])
    }
    return [vec3Vector, buffer.count, geometry.index]
}
