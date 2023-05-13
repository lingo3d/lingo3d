import { managerControllerMap } from "../../collections/pxCollections"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import {
    assignPxExtendedVec,
    assignPxTransform,
    setPxVec
} from "../../engine/physx/pxMath"
import { physxLoopPtr } from "../../pointers/physxLoopPtr"
import configSystem from "../utils/configSystem"

export const [addConfigPhysicsTransformSystem] = configSystem(
    (manager: PhysicsObjectManager) => {
        const controller = managerControllerMap.get(manager)
        if (controller) {
            controller.setPosition(assignPxExtendedVec(manager.position))
            if (physxLoopPtr[0]) return
        }
        manager.$actor.setGlobalPose(assignPxTransform(manager))
        if (!("setLinearVelocity" in manager.$actor)) return
        manager.$actor.setLinearVelocity(setPxVec(0, 0, 0))
        manager.$actor.setAngularVelocity(setPxVec(0, 0, 0))
    }
)
