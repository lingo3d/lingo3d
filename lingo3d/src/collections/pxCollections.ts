import PhysicsObjectManager from "../display/core/PhysicsObjectManager"

export const pxUpdateSet = new Set<PhysicsObjectManager>()
export const pxVXUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const pxVYUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const pxVZUpdateMap = new WeakMap<PhysicsObjectManager, number>()
export const groundedControllerManagers = new Set<PhysicsObjectManager>()
