import {
    Light,
    Bone,
    Object3D,
    Mesh,
    MeshStandardMaterial,
    DoubleSide
} from "three"
import createTextureManager from "./createTextureManager"
import { textureManagerMap } from "../../../../collections/textureManagerMap"

export default (group: Object3D, noBonePtr: [boolean]) => {
    const lights: Array<Light> = []
    group.traverse((child: Object3D | Mesh | Light | Bone) => {
        if ("isLight" in child) lights.push(child)
        else if (noBonePtr[0] && "isBone" in child) noBonePtr[0] = false

        if (!("material" in child)) return
        if (Array.isArray(child.material)) child.material = child.material[0]

        child.material.side = DoubleSide

        textureManagerMap.set(
            child.material,
            createTextureManager(child.material as MeshStandardMaterial)
        )
    })
    for (const light of lights) light.parent!.remove(light)
}
