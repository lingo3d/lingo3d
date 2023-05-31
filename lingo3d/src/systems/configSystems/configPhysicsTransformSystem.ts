import { managerControllerMap } from "../../collections/pxCollections"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import {
    assignPxExtendedVec,
    assignPxTransform,
    setPxVec
} from "../../engine/physx/pxMath"
import { dtPtr } from "../../pointers/dtPtr"
import { physxLoopPtr } from "../../pointers/physxLoopPtr"
import { physxPtr } from "../../pointers/physxPtr"
import createSystem from "../utils/createInternalSystem"

export const configPhysicsTransformSystem = createSystem(
    "configPhysicsTransformSystem",
    {
        effect: (self: PhysicsObjectManager) => {
            const controller = managerControllerMap.get(self)
            if (controller) {
                if (physxLoopPtr[0]) {
                    const { x: px, y: py, z: pz } = self.position
                    const { x: cx, y: cy, z: cz } = controller.getPosition()
                    controller.move(
                        setPxVec(px - cx, py - cy, pz - cz),
                        0.001,
                        dtPtr[0],
                        physxPtr[0].pxControllerFilters
                    )
                    return
                }
                controller.setPosition(assignPxExtendedVec(self.position))
            }
            self.$actor.setGlobalPose(assignPxTransform(self))
            if (!("setLinearVelocity" in self.$actor)) return
            self.$actor.setLinearVelocity(setPxVec(0, 0, 0))
            self.$actor.setAngularVelocity(setPxVec(0, 0, 0))
        }
    }
)
