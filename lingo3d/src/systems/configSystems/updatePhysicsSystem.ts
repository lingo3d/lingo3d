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
        let modeChanged = mode !== self.userData.physicsMode
        if (modeChanged && !mode && !self.userData.physicsMode)
            modeChanged = false
        self.userData.physicsMode = mode

        if ((self.actor && pxUpdateShapeSet.has(self)) || modeChanged)
            addRefreshPhysicsSystem(self)
        else if (self.actor) addUpdatePhysicsTransformSystem(self)
    }
)
