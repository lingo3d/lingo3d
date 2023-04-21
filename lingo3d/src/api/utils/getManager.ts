import { Object3D } from "three"
import MeshAppendable from "../core/MeshAppendable"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"
import Loaded from "../../display/core/Loaded"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"

const objectManagerMap = new WeakMap<
    Object3D,
    MeshAppendable | VisibleMixin | Loaded | PhysicsObjectManager
>()

export const getManager = (target: Object3D) => objectManagerMap.get(target)

export const getPhysicsObjectManager = (target: Object3D) => {
    const result = objectManagerMap.get(target)
    if (result && "physics" in result) return result
}

export const setManager = <T extends MeshAppendable>(
    target: Object3D,
    manager: T
): T => {
    objectManagerMap.set(target, manager)
    return manager
}
