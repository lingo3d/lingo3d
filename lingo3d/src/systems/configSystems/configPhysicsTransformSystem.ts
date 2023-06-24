import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import {
    assignPxExtendedVec,
    assignPxTransform,
    setPxVec
} from "../../engine/physx/pxMath"
import { physxLoopPtr } from "../../pointers/physxLoopPtr"
import createInternalSystem from "../utils/createInternalSystem"

export const configPhysicsTransformSystem = createInternalSystem(
    "configPhysicsTransformSystem",
    {
        effect: (self: PhysicsObjectManager) => {
            if (self.$controller) {
                if (physxLoopPtr[0]) return
                self.$controller.setPosition(assignPxExtendedVec(self.position))
            }
            self.$actor.setGlobalPose(assignPxTransform(self))
            if (!("setLinearVelocity" in self.$actor)) return
            self.$actor.setLinearVelocity(setPxVec(0, 0, 0))
            self.$actor.setAngularVelocity(setPxVec(0, 0, 0))
        }
    }
)
