import { Object3D, Vector3 } from "three"
import getCenter from "./getCenter"
import measure from "./measure"

const cache = new Map<string, [number, Vector3, Vector3]>()

export default (gltf: Object3D, src: string) => {
    if (cache.has(src)) {
        const [ratio, center, result] = cache.get(src)!
        gltf.scale.multiplyScalar(ratio)
        gltf.position.copy(center).multiplyScalar(-1)
        return result
    }

    const measuredSize = measure(gltf, src).clone()

    const ratio = 1 / measuredSize.y
    gltf.scale.multiplyScalar(ratio)

    const center = getCenter(gltf)
    gltf.position.copy(center).multiplyScalar(-1)

    measuredSize.multiplyScalar(ratio)

    cache.set(src, [ratio, center, measuredSize])
    return measuredSize
}
