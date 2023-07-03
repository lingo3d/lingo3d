import MeshAppendable from "../display/core/MeshAppendable"
import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import createMap from "../utils/createMap"

export const controllerVXUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const controllerVYUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const controllerVZUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const groundedControllerManagers = new Set<PhysicsObjectManager>()
export const managerActorMap = createMap<PhysicsObjectManager, any>()
export const actorPtrManagerMap = createMap<number, PhysicsObjectManager>()
export const managerActorPtrMap = new WeakMap<MeshAppendable, number>()
export const managerGeometryMap = new WeakMap<MeshAppendable, any>()
export const managerControllerMap = createMap<PhysicsObjectManager, any>()
export const controllerManagerMap = new WeakMap<any, PhysicsObjectManager>()
export const managerContactMap = new WeakMap<
    PhysicsObjectManager,
    WeakSet<PhysicsObjectManager>
>()
export const controllerManagerContactMap = new WeakMap<
    PhysicsObjectManager,
    Set<PhysicsObjectManager>
>()
