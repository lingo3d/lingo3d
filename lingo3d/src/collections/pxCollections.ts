import MeshAppendable from "../api/core/MeshAppendable"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"

export const pxUpdateSet = new Set<PhysicsObjectManager>()
export const pxVXUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const pxVYUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const pxVZUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const groundedControllerManagers = new Set<PhysicsObjectManager>()
export const managerActorMap = new Map<PhysicsObjectManager, any>()
export const actorPtrManagerMap = new Map<number, PhysicsObjectManager>()
export const managerActorPtrMap = new WeakMap<MeshAppendable, number>()
export const managerControllerMap = new Map<PhysicsObjectManager, any>()
export const controllerManagerMap = new Map<any, PhysicsObjectManager>()
export const managerContactMap = new WeakMap<
    PhysicsObjectManager,
    WeakSet<PhysicsObjectManager>
>()
export const controllerManagerContactMap = new WeakMap<
    PhysicsObjectManager,
    Set<PhysicsObjectManager>
>()
export const pxUpdateShapeSet = new WeakSet<MeshAppendable>()
