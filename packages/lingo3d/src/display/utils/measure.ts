import { Object3D, Vector3 } from "three"
import { box3 } from "./reusables"

export default (gltf: Object3D) => {
    const gltfSize = new Vector3()
    box3.setFromObject(gltf).getSize(gltfSize)
    return gltfSize
}