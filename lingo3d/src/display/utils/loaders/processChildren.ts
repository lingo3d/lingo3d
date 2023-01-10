import {
    Light,
    Bone,
    Object3D,
    Mesh,
    BufferGeometry,
    MeshStandardMaterial
} from "three"
import createTextureManager from "./createTextureManager"

export default (group: Object3D, noBonePtr: [boolean]) => {
    const lights: Array<Light> = []
    group.traverse(
        (child: Object3D | Mesh<BufferGeometry, MeshStandardMaterial>) => {
            if (child instanceof Light) lights.push(child)
            else if (noBonePtr[0] && child instanceof Bone) noBonePtr[0] = false

            if ("material" in child)
                child.material.userData.TextureManager = createTextureManager(
                    child.material
                )
            child.castShadow = true
            child.receiveShadow = true
        }
    )
    for (const light of lights) light.parent?.remove(light)
}
