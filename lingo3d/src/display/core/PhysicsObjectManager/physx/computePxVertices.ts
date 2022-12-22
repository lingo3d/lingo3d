import { Object3D, BufferGeometry, Mesh } from "three"
import MeshAppendable from "../../../../api/core/MeshAppendable"
import { getPhysX } from "../../../../states/usePhysX"

export default (loaded: Object3D, manager: MeshAppendable) => {
    const { Vector_PxVec3 } = getPhysX()

    let vertexCount = 0
    const geometries: Array<BufferGeometry> = []

    loaded.updateMatrixWorld()
    const { x, y, z } = manager.outerObject3d.position
    loaded.traverse((c: Object3D | Mesh) => {
        if (!("geometry" in c)) return
        const clone = c.geometry.clone()
        clone.applyMatrix4(c.matrixWorld)
        clone.translate(-x, -y, -z)
        clone.dispose()
        geometries.push(clone)
        vertexCount += clone.attributes.position.count
    })

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
    return <const>[vec3Vector, vertexCount]
}
