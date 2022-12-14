import { BufferAttribute, Object3D, BufferGeometry, Mesh } from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils"
import { getPhysX } from "../../../../states/usePhysX"

const mergedPxVerticesCache = new Map<
    string | undefined,
    readonly [any, number, BufferAttribute]
>()

export default (src: string | undefined, loaded: Object3D) => {
    if (mergedPxVerticesCache.has(src)) return mergedPxVerticesCache.get(src)!

    const { Vector_PxVec3 } = getPhysX()

    const geometries: Array<BufferGeometry> = []
    loaded.traverse(
        (c: Object3D | Mesh) => "geometry" in c && geometries.push(c.geometry)
    )
    const geometry = BufferGeometryUtils.mergeBufferGeometries(geometries)

    const { x, y, z } = loaded.scale
    geometry.scale(x, y, z)
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
    // vec3Vector.destroy()

    const result = <const>[vec3Vector, buffer.count, geometry.index!]
    mergedPxVerticesCache.set(src, result)
    return result
}
