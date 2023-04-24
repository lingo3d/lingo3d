import { addRefreshPhysicsSystem } from "./refreshPhysicsSystem"
import { addConfigPhysicsTransformSystem } from "./configPhysicsTransformSystem"
import configLoadedSystem from "../utils/configLoadedSystem"

export const [addConfigPhysicsSystem] = configLoadedSystem((self) => {
    if (!("physics" in self)) return

    const mode = self.physics || !!self.jointCount
    let modeChanged = mode !== self.userData.physicsMode
    if (modeChanged && !mode && !self.userData.physicsMode) modeChanged = false
    self.userData.physicsMode = mode

    if (modeChanged) addRefreshPhysicsSystem(self)
    else if (self.actor) addConfigPhysicsTransformSystem(self)
})
