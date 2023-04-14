import { Object3D, SkeletonHelper, Vector3 } from "three"
import getCenter from "../../utilsCached/getCenter"
import { measure } from "../../utilsCached/measure"

const cache = new Map<string, [number, Vector3, Vector3]>()

export default (gltf: Object3D, src: string) => {
    if (cache.has(src)) {
        const [ratio, center, result] = cache.get(src)!
        gltf.scale.multiplyScalar(ratio)
        gltf.position.copy(center).multiplyScalar(-1)
        return result
    }

    const measuredSize = measure(src, { target: gltf }).clone()
    const ratio = 1 / measuredSize.y

    const skeleton = new SkeletonHelper(gltf)
    skeleton.updateMatrixWorld()
    const center = getCenter(skeleton.bones.length ? skeleton : gltf)

    center.multiplyScalar(ratio)
    measuredSize.multiplyScalar(ratio)

    gltf.scale.multiplyScalar(ratio)
    gltf.position.copy(center).multiplyScalar(-1)

    cache.set(src, [ratio, center, measuredSize])
    return measuredSize
}
