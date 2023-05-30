import { configPhysicsShapeSystem } from "../configSystems/configPhysicsShapeSystem"
import { configPhysicsTransformSystem } from "../configSystems/configPhysicsTransformSystem"
import configLoadedSystem from "../utils/configLoadedSystem"

export const [addConfigPhysicsSystem] = configLoadedSystem((self) => {
    if (!("physics" in self)) return

    const mode = self.physics || !!self.$jointCount
    let modeChanged = mode !== self.userData.physicsMode
    if (modeChanged && !mode && !self.userData.physicsMode) modeChanged = false
    self.userData.physicsMode = mode

    if (modeChanged) configPhysicsShapeSystem.add(self)
    else if (self.$actor) configPhysicsTransformSystem.add(self)
})
