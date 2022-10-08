import { forceGet } from "@lincode/utils"
import { MeshStandardMaterial, Object3D } from "three"
import BasicMaterialManager from "./BasicMaterialManager"
import StandardMaterialManager from "./StandardMaterialManager"

const materialMap = new Map<string, MeshStandardMaterial>()

const allocateMaterial = (desc: Partial<MeshStandardMaterial>) => {
    let hash = ""
    for (const key of Object.keys(desc).sort())
        hash += `${key}:${(desc as any)[key]};`

    return forceGet(materialMap, hash, () => {
        const material = new MeshStandardMaterial()
        Object.assign(material, desc)
        return material
    })
}

const materialManagerMap = new WeakMap<
    Object3D,
    StandardMaterialManager | undefined
>()

export const attachStandardMaterialManager = (
    target: Object3D,
    recursive?: boolean
) =>
    forceGet(materialManagerMap, target, () => {
        const { material } = target as any
        if (!material) return

        if (recursive)
            target.traverse(
                (child) =>
                    child !== target && attachStandardMaterialManager(child)
            )

        return (target.userData.materialManager = new StandardMaterialManager(
            ((target as any).material = material.clone())
        ))
    })

export const attachBasicMaterialManager = (target: Object3D) =>
    forceGet(materialManagerMap, target, () => {
        const { material } = target as any
        if (!material) return

        return new BasicMaterialManager(
            ((target as any).material = material.clone())
        )
    })
