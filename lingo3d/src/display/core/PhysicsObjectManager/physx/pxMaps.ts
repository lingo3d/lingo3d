import PhysicsObjectManager from ".."
import MeshItem from "../../MeshItem"

export const managerActorMap = new Map<PhysicsObjectManager, any>()
export const actorPtrManagerMap = new Map<number, PhysicsObjectManager>()
export const managerActorPtrMap = new WeakMap<MeshItem, number>()
export const managerControllerMap = new Map<PhysicsObjectManager, any>()
