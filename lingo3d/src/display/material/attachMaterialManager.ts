import { forceGet } from "@lincode/utils"
import { Object3D } from "three"
import BasicMaterialManager from "./BasicMaterialManager"
import StandardMaterialManager from "./StandardMaterialManager"

const materialManagerMap = new WeakMap<
    Object3D,
    Array<StandardMaterialManager>
>()

export const attachStandardMaterialManager = (
    target: Object3D,
    recursive?: boolean,
    result: Array<StandardMaterialManager> = []
) =>
    forceGet(materialManagerMap, target, () => {
        const { material } = target as any
        if (!material) return result

        if (recursive)
            target.traverse(
                (child) =>
                    child !== target &&
                    attachStandardMaterialManager(child, false, result)
            )

        result.push(
            (target.userData.materialManager = new StandardMaterialManager(
                ((target as any).material = material.clone())
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
