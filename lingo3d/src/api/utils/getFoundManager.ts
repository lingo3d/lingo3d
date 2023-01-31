import { Object3D } from "three"
import { getManager, setManager } from "./getManager"
import FoundManager from "../../display/core/FoundManager"
import ObjectManager from "../../display/core/ObjectManager"

export const getFoundManager = (
    child: Object3D,
    parentManager: ObjectManager,
    hiddenFromSceneGraph?: boolean
) => {
    const childManager = getManager(child)
    if (childManager instanceof FoundManager) return childManager

    const result = setManager(child, new FoundManager(child, parentManager))
    //@ts-ignore
    !hiddenFromSceneGraph && parentManager._append(result)

    return result
}
