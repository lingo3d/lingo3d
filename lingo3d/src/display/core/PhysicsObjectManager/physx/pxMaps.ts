import PhysicsObjectManager from ".."
import MeshAppendable from "../../../../api/core/MeshAppendable"
import throttleFrame from "../../../../utils/throttleFrame"

export const managerActorMap = new Map<PhysicsObjectManager, any>()
export const actorPtrManagerMap = new Map<number, PhysicsObjectManager>()
export const managerActorPtrMap = new WeakMap<MeshAppendable, number>()
export const managerControllerMap = new Map<PhysicsObjectManager, any>()
export const managerShapeLinkMap = new Map<PhysicsObjectManager, [any, any]>()
export const managerContactMap = new Map<
    PhysicsObjectManager,
    WeakSet<PhysicsObjectManager>
>()
export const queueClearContactMap = throttleFrame(() =>
    managerContactMap.clear()
)
