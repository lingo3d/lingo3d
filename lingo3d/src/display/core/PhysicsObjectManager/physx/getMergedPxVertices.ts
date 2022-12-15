import { Object3D, BufferGeometry, Mesh } from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import Appendable from "../../../../api/core/Appendable"
import { getPhysX } from "../../../../states/usePhysX"

export default (loaded: Object3D, manager: Appendable) => {
    const { Vector_PxVec3 } = getPhysX()

    const geometries: Array<BufferGeometry> = []
    const geometriesUV2: Array<BufferGeometry> = []

    loaded.updateMatrixWorld()
    const { x, y, z } = manager.outerObject3d.position
    loaded.traverse((c: Object3D | Mesh) => {
        if (!("geometry" in c)) return
        const clone = c.geometry.clone()
        clone.applyMatrix4(c.matrixWorld)
        clone.translate(-x, -y, -z)
        clone.dispose()
        ;(c.geometry.attributes.uv2 ? geometriesUV2 : geometries).push(clone)
    })
    const geometry = BufferGeometryUtils.mergeBufferGeometries(
        geometriesUV2.length > geometries.length ? geometriesUV2 : geometries
    )
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
    return <const>[vec3Vector, buffer.count, geometry.index!]
}
