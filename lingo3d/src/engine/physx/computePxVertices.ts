import { Object3D, BufferGeometry, Mesh, BufferAttribute } from "three"
import MeshAppendable from "../../display/core/MeshAppendable"
import Loaded from "../../display/core/Loaded"
import { physxPtr } from "../../pointers/physxPtr"

export default (manager: MeshAppendable | Loaded): [any, number] => {
    const { Vector_PxVec3 } = physxPtr[0]

    let vertexCount = 0
    const geometries: Array<BufferGeometry> = []

    const loaded =
        "$loadedObject3d" in manager
            ? manager.$loadedObject3d!
            : manager.$innerObject
    loaded.updateMatrixWorld()

    const { position, rotation } = manager.$object
    loaded.traverse((c: Object3D | Mesh) => {
        if (!("geometry" in c)) return
        const clone = c.geometry.clone()
        clone.applyMatrix4(c.matrixWorld)
        clone.translate(-position.x, -position.y, -position.z)
        clone.rotateX(-rotation.x)
        clone.rotateY(-rotation.y)
        clone.rotateZ(-rotation.z)
        clone.dispose()
        geometries.push(clone)
        vertexCount += clone.attributes.position.count
    })

    const vec3Vector = new Vector_PxVec3(vertexCount)

    let iTotal = 0
    for (const geometry of geometries) {
        const buffer = geometry.attributes.position as BufferAttribute
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
