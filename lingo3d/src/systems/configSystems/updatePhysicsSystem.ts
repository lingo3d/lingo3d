import MeshAppendable from "../../api/core/MeshAppendable"
import { pxUpdateShapeSet } from "../../collections/pxUpdateShapeSet"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import configSystem from "../utils/configSystem"
import { addRefreshPhysicsSystem } from "./refreshPhysicsSystem"
import { addUpdatePhysicsTransformSystem } from "./updatePhysicsTransformSystem"

export const [addUpdatePhysicsSystem] = configSystem(
    (self: MeshAppendable | PhysicsObjectManager) => {
        if (!("physics" in self) || !self.actor) return
        if (pxUpdateShapeSet.has(self)) {
            pxUpdateShapeSet.delete(self)
            addRefreshPhysicsSystem(self, true)
            return
        }
        addUpdatePhysicsTransformSystem(self)
    }
)
