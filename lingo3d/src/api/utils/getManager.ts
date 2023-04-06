import { Object3D } from "three"
import MeshAppendable from "../core/MeshAppendable"
import VisibleMixin from "../../display/core/mixins/VisibleMixin"

const objectManagerMap = new WeakMap<Object3D, MeshAppendable | VisibleMixin>()

export const getManager = (target: Object3D) => objectManagerMap.get(target)

export const setManager = <T extends MeshAppendable>(
    target: Object3D,
    manager: T
): T => {
    if (objectManagerMap.has(target)) return manager
    objectManagerMap.set(target, manager)
    return manager
}
