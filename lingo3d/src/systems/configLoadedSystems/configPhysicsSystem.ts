import MeshAppendable from "../../display/core/MeshAppendable"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { configPhysicsShapeSystem } from "../configSystems/configPhysicsShapeSystem"
import { configPhysicsTransformSystem } from "../configSystems/configPhysicsTransformSystem"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configPhysicsSystem = createLoadedEffectSystem(
    "configPhysicsSystem",
    {
        effect: (self: MeshAppendable | PhysicsObjectManager) => {
            if (!("physics" in self)) return

            const mode = self.physics || !!self.$jointCount
            let modeChanged = mode !== self.userData.physicsMode
            if (modeChanged && !mode && !self.userData.physicsMode)
                modeChanged = false
            self.userData.physicsMode = mode

            if (modeChanged) configPhysicsShapeSystem.add(self)
            else if (self.$actor) configPhysicsTransformSystem.add(self)
        },
        effectTicker: queueMicrotask
    }
)
