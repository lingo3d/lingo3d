import { forceGet } from "@lincode/utils"
import { MeshStandardMaterial, Object3D } from "three"
import BasicMaterialManager from "./BasicMaterialManager"
import StandardMaterialManager from "./StandardMaterialManager"

const materialManagerMap = new WeakMap<
    Object3D,
    Array<StandardMaterialManager>
>()

export const attachStandardMaterialManager = (
    target: Object3D,
    recursive?: boolean,
    result: Array<StandardMaterialManager> = [],
    recursiveClonedMap?: WeakMap<MeshStandardMaterial, MeshStandardMaterial>
) =>
    forceGet(materialManagerMap, target, () => {
        if (recursive) {
            const recursiveCache = new WeakMap()
            target.traverse((child) =>
                attachStandardMaterialManager(
                    child,
                    false,
                    result,
                    recursiveCache
                )
            )
            return result
        }

        const { material } = target as any
        if (!material) return result

        if (recursiveClonedMap?.has(material)) {
            ;(target as any).material = recursiveClonedMap.get(material)
            return result
        }

        const clone = ((target as any).material = material.clone())
        recursiveClonedMap?.set(material, clone)

        result.push(
            (target.userData.materialManager = new StandardMaterialManager(
                clone
            ))
        )
        return result
    })

export const attachBasicMaterialManager = (target: Object3D) =>
    forceGet(materialManagerMap, target, () => {
        const { material } = target as any
        if (!material) return []

        return [
            new BasicMaterialManager(
                ((target as any).material = material.clone())
            )
        ]
    })
