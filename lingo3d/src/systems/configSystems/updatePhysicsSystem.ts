import MeshAppendable from "../../api/core/MeshAppendable"
import { pxUpdateShapeSet } from "../../collections/pxUpdateShapeSet"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import configSystem from "../utils/configSystem"
import { addRefreshPhysicsSystem } from "./refreshPhysicsSystem"
import { addUpdatePhysicsTransformSystem } from "./updatePhysicsTransformSystem"

export const [addUpdatePhysicsSystem] = configSystem(
    (self: MeshAppendable | PhysicsObjectManager) => {
        if (!("physics" in self)) return

        const mode = self.physics || !!self.jointCount
        const init = mode && !self.userData.physicsMode
        self.userData.physicsMode = mode

        if (!mode) return

        if (pxUpdateShapeSet.has(self) || init) {
            pxUpdateShapeSet.delete(self)
            addRefreshPhysicsSystem(self)
            return
        }
        addUpdatePhysicsTransformSystem(self)
    }
)
