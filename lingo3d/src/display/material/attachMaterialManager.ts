import { forceGet } from "@lincode/utils"
import { Object3D } from "three"
import BasicMaterialManager from "./BasicMaterialManager"
import StandardMaterialManager from "./StandardMaterialManager"

const materialManagerMap = new WeakMap<
    Object3D,
    StandardMaterialManager | undefined
>()

export const attachStandardMaterialManager = (
    target: Object3D,
    recursive?: boolean
) =>
    forceGet(materialManagerMap, target, () => {
        if (recursive) {
            target.traverse((child) => {
                attachStandardMaterialManager(child)
            })
            return
        }
        //@ts-ignore
        const { material } = target
        if (!material) return
        //@ts-ignore
        return new StandardMaterialManager((target.material = material.clone()))
    })

export const attachBasicMaterialManager = (target: Object3D) =>
    forceGet(materialManagerMap, target, () => {
        //@ts-ignore
        const { material } = target
        if (!material) return
        //@ts-ignore
        return new BasicMaterialManager((target.material = material.clone()))
    })
