import { managerControllerMap } from "../../collections/pxCollections"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import {
    assignPxTransform,
    assignPxVec,
    setPxVec
} from "../../engine/physx/pxMath"
import configSystem from "../utils/configSystem"

export const [addConfigPhysicsTransformSystem] = configSystem(
    (manager: PhysicsObjectManager) => {
        const controller = managerControllerMap.get(manager)
        controller?.setPosition(assignPxVec(manager.position))
        manager.$actor.setGlobalPose(assignPxTransform(manager))
        if (!("setLinearVelocity" in manager.$actor)) return
        manager.$actor.setLinearVelocity(setPxVec(0, 0, 0))
        manager.$actor.setAngularVelocity(setPxVec(0, 0, 0))
    }
)
