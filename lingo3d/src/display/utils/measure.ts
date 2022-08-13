import { Object3D, Vector3 } from "three"
import { box3 } from "./reusables"

const cache = new Map<string, Vector3>()

export default (gltf: Object3D, src: string) => {
    if (cache.has(src)) return cache.get(src)!.clone()

    const gltfSize = new Vector3()
    box3.setFromObject(gltf).getSize(gltfSize)
    cache.set(src, gltfSize.clone())
    return gltfSize
}
