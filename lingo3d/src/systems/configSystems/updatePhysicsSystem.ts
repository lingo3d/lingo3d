import MeshAppendable from "../../api/core/MeshAppendable"
import { pxUpdateSet, pxUpdateShapeSet } from "../../collections/pxCollections"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import configSystem from "../utils/configSystem"
import { addRefreshPhysicsSystem } from "./refreshPhysicsSystem"

export const [addUpdatePhysicsSystem] = configSystem(
    (self: MeshAppendable | PhysicsObjectManager) => {
        if (!("physics" in self) || !self.actor) return
        if (pxUpdateShapeSet.has(self)) {
            pxUpdateShapeSet.delete(self)
            addRefreshPhysicsSystem(self, true)
            return
        }
        pxUpdateSet.add(self)
    }
)
