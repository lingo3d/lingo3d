import { Object3D, BufferGeometry, Mesh } from "three"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import Loaded from "../../Loaded"
import { physxPtr } from "./physxPtr"

export default (manager: MeshAppendable | Loaded) => {
    const { Vector_PxVec3 } = physxPtr[0]

    let vertexCount = 0
    const geometries: Array<BufferGeometry> = []

    if ("loadedObject3d" in manager) {
        const loaded = manager.loadedObject3d!
        loaded.updateMatrixWorld()
        const { x, y, z } = manager.position
        loaded.traverse((c: Object3D | Mesh) => {
            if (!("geometry" in c)) return
            const clone = c.geometry.clone()
            clone.applyMatrix4(c.matrixWorld)
            clone.translate(-x, -y, -z)
            clone.dispose()
            geometries.push(clone)
            vertexCount += clone.attributes.position.count
        })
    } else if ("geometry" in manager.object3d) {
        const { geometry } = manager.object3d
        geometries.push(geometry)
        vertexCount += geometry.attributes.position.count
    }

    const vec3Vector = new Vector_PxVec3(vertexCount)

    let iTotal = 0
    for (const geometry of geometries) {
        const buffer = geometry.attributes.position
        const vertices = buffer.array
        for (let i = 0; i < buffer.count; i++) {
            const pxVec3 = vec3Vector.at(iTotal++)
            const offset = i * 3
            pxVec3.set_x(vertices[offset])
            pxVec3.set_y(vertices[offset + 1])
            pxVec3.set_z(vertices[offset + 2])
        }
    }
    return [vec3Vector, vertexCount]
}
