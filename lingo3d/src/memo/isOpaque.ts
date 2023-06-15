import { Mesh, MeshStandardMaterial, Object3D } from "three"
import computePerFrame from "./utils/computePerFrame"

export default computePerFrame((target: Object3D) => {
    const material = (target as Mesh).material as MeshStandardMaterial
    if (!material) return true
    return material.opacity >= 1 && !material.alphaMap
})
