import { managerControllerMap } from "../../collections/pxCollections"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { assignPxTransform, setPxVec } from "../../engine/physx/pxMath"
import { dtPtr } from "../../pointers/dtPtr"
import { physxPtr } from "../../pointers/physxPtr"
import configSystem from "../utils/configSystem"

export const [addUpdatePhysicsTransformSystem] = configSystem(
    (manager: PhysicsObjectManager) => {
        const controller = managerControllerMap.get(manager)
        if (controller) {
            const { x: px, y: py, z: pz } = manager.position
            const { x: cx, y: cy, z: cz } = controller.getPosition()
            controller.move(
                setPxVec(px - cx, py - cy, pz - cz),
                0.001,
                dtPtr[0],
                physxPtr[0].pxControllerFilters
            )
            return
        }
        manager.actor.setGlobalPose(assignPxTransform(manager))
        if (!("setLinearVelocity" in manager.actor)) return
        manager.actor.setLinearVelocity(setPxVec(0, 0, 0))
        manager.actor.setAngularVelocity(setPxVec(0, 0, 0))
    }
)
