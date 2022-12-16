import { Object3D } from "three"
import PhysicsObjectManager from ".."

export const objectActorMap = new Map<Object3D, any>()
export const objectCharacterActorMap = new Map<Object3D, any>()
export const managerControllerMap = new Map<PhysicsObjectManager, any>()
export const controllerActorMap = new WeakMap<any, any>()
