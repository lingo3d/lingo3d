import PhysicsObjectManager from ".."

export const managerActorMap = new Map<PhysicsObjectManager, any>()
export const actorManagerMap = new WeakMap<any, PhysicsObjectManager>()
export const managerControllerMap = new Map<PhysicsObjectManager, any>()
