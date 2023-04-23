import MeshAppendable from "../../api/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import configSystem from "../utils/configSystem"
import { addRefreshPhysicsSystem } from "./refreshPhysicsSystem"
import { addConfigPhysicsTransformSystem } from "./configPhysicsTransformSystem"

export const [addConfigPhysicsSystem] = configSystem(
    (self: MeshAppendable | PhysicsObjectManager) => {
        if (!("physics" in self)) return

        const mode = self.physics || !!self.jointCount
        let modeChanged = mode !== self.userData.physicsMode
        if (modeChanged && !mode && !self.userData.physicsMode)
            modeChanged = false
        self.userData.physicsMode = mode

        if (modeChanged) addRefreshPhysicsSystem(self)
        else if (self.actor) addConfigPhysicsTransformSystem(self)
    }
)
