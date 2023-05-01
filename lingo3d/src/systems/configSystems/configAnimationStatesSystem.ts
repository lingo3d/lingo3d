import AnimationStates from "../../display/core/AnimatedObjectManager/AnimationStates"
import configSystem from "../utils/configSystem"

export const [addConfigAnimationStatesSystem] = configSystem(
    (self: AnimationStates) => {
        if (self.manager) self.manager.paused = self.paused
    }
)
