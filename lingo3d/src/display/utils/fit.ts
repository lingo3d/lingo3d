import { Object3D, Vector3 } from "three"
import { measure } from "../../memo/measure"
import { createUnloadMap } from "../../utils/createUnloadMap"

const cache = createUnloadMap<string, [number, Vector3, Vector3]>()

export default (gltf: Object3D, src: string) => {
    if (cache.has(src)) {
        const [ratio, center, size] = cache.get(src)!
        gltf.scale.multiplyScalar(ratio)
        gltf.position.copy(center).multiplyScalar(-1)
        return <const>[size, center, ratio]
    }

    let [size, center] = measure(src, { target: gltf })
    const ratio = 1 / size.y

    center = center.clone().multiplyScalar(ratio)
    size = size.clone().multiplyScalar(ratio)

    gltf.scale.multiplyScalar(ratio)
    gltf.position.copy(center).multiplyScalar(-1)

    cache.set(src, [ratio, center, size])
    return <const>[size, center, ratio]
}
