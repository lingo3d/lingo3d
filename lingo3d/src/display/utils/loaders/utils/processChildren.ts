import {
    Light,
    Bone,
    Object3D,
    Mesh,
    MeshStandardMaterial,
    DoubleSide
} from "three"
import createTextureManager from "./createTextureManager"

export default (group: Object3D, noBonePtr: [boolean]) => {
    const lights: Array<Light> = []
    group.traverse((child: Object3D | Mesh) => {
        if (child instanceof Light) lights.push(child)
        else if (noBonePtr[0] && child instanceof Bone) noBonePtr[0] = false

        if (!("material" in child)) return
        if (Array.isArray(child.material)) child.material = child.material[0]

        child.material.side = DoubleSide

        if (child.material.opacity === 1)
            child.castShadow = child.receiveShadow = true

        child.material.userData.TextureManager = createTextureManager(
            child.material as MeshStandardMaterial
        )
    })
    for (const light of lights) light.parent?.remove(light)
}
