import PhysicsObjectManager from ".."
import MeshManager from "../../MeshManager"

export const managerActorMap = new Map<PhysicsObjectManager, any>()
export const actorPtrManagerMap = new Map<number, PhysicsObjectManager>()
export const managerActorPtrMap = new WeakMap<MeshManager, number>()
export const managerControllerMap = new Map<PhysicsObjectManager, any>()
export const managerShapeLinkMap = new Map<PhysicsObjectManager, [any, any]>()
