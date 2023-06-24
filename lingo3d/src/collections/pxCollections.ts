import MeshAppendable from "../display/core/MeshAppendable"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"

export const controllerVXUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const controllerVYUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const controllerVZUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const controllerMoveSet = new WeakSet<PhysicsObjectManager>()
export const groundedControllerManagers = new Set<PhysicsObjectManager>()
export const managerActorMap = new Map<PhysicsObjectManager, any>()
export const actorPtrManagerMap = new Map<number, PhysicsObjectManager>()
export const managerActorPtrMap = new WeakMap<MeshAppendable, number>()
export const managerControllerMap = new Map<PhysicsObjectManager, any>()
export const controllerManagerMap = new WeakMap<any, PhysicsObjectManager>()
export const managerContactMap = new WeakMap<
    PhysicsObjectManager,
    WeakSet<PhysicsObjectManager>
>()
export const controllerManagerContactMap = new WeakMap<
    PhysicsObjectManager,
    Set<PhysicsObjectManager>
>()
