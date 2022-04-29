import { Object3D, Vector3 } from "three"
import getCenter from "./getCenter"
import measure from "./measure"

const cache = new Map<string, [number, Vector3, Vector3]>()

export default (gltf: Object3D, src: string) => {
    const cached = cache.get(src)
    if (cached) {
        const [ratio, center, result] = cached
        gltf.scale.multiplyScalar(ratio)
        gltf.position.copy(center).multiplyScalar(-1)
        return result
    }

    const gltfSize = measure(gltf)

    const ratio = 1 / gltfSize.y
    gltf.scale.multiplyScalar(ratio)

    const center = getCenter(gltf)
    gltf.position.copy(center).multiplyScalar(-1)

    const result = gltfSize.multiplyScalar(ratio)
    cache.set(src, [ratio, center.clone(), result.clone()])

    return result
}