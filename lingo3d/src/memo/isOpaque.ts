import { Material, Mesh, Object3D } from "three"
import computePerFrame from "./utils/computePerFrame"

export default computePerFrame((target: Object3D) => {
    const material = (target as Mesh).material as Material
    if (!material) return true
    return material.transparent
})
