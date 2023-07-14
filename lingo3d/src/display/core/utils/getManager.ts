import { Object3D } from "three"
import MeshAppendable from "../MeshAppendable"
import VisibleMixin from "../mixins/VisibleMixin"
import Loaded from "../Loaded"
import PhysicsObjectManager from "../PhysicsObjectManager"

type Type = MeshAppendable | VisibleMixin | Loaded | PhysicsObjectManager

const objectManagerMap = new WeakMap<Object3D, Type>()

export const getManager = <T extends Type>(target: Object3D) =>
    objectManagerMap.get(target) as T | undefined

export const setManager = (target: Object3D, manager: MeshAppendable) => {
    objectManagerMap.set(target, manager)
    return target
}
