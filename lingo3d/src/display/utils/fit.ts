import { Object3D, Vector3 } from "three"
import measure from "./measure"
import { box3, vector3 } from "./reusables"

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

    const center = box3.setFromObject(gltf).getCenter(vector3)
    gltf.position.copy(center).multiplyScalar(-1)

    const result = gltfSize.multiplyScalar(ratio)
    cache.set(src, [ratio, center.clone(), result.clone()])

    return result
}