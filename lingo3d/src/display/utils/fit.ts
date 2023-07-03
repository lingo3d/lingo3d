import { Object3D, Vector3 } from "three"
import { measure } from "../../memo/measure"
import createMap from "../../utils/createMap"

const cache = createMap<string, [number, Vector3, Vector3]>()

export default (gltf: Object3D, src: string) => {
    if (cache.has(src)) {
        const [ratio, center, size] = cache.get(src)!
        gltf.scale.multiplyScalar(ratio)
        gltf.position.copy(center).multiplyScalar(-1)
        return [size, center]
    }

    let [size, center] = measure(src, { target: gltf })
    const ratio = 1 / size.y

    center = center.clone().multiplyScalar(ratio)
    size = size.clone().multiplyScalar(ratio)

    gltf.scale.multiplyScalar(ratio)
    gltf.position.copy(center).multiplyScalar(-1)

    cache.set(src, [ratio, center, size])
    return [size, center]
}
