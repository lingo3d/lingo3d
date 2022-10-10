import { forceGet } from "@lincode/utils"
import { MeshStandardMaterial, Object3D } from "three"
import Appendable from "../../api/core/Appendable"
import BasicMaterialManager from "./BasicMaterialManager"
import StandardMaterialManager from "./StandardMaterialManager"

const materialManagerMap = new WeakMap<
    Object3D,
    Array<StandardMaterialManager>
>()

export const attachStandardMaterialManager = (
    target: Object3D,
    manager: Appendable,
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
                    manager,
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

        const materialManager = new StandardMaterialManager(clone)

        manager.append(materialManager)
        result.push(materialManager)

        return result
    })

export const attachBasicMaterialManager = (
    target: Object3D,
    manager: Appendable
) =>
    forceGet(materialManagerMap, target, () => {
        const { material } = target as any
        if (!material) return []

        const materialManager = new BasicMaterialManager(
            ((target as any).material = material.clone())
        )
        manager.append(materialManager)

        return [materialManager]
    })
