import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import configSystem from "../utils/configSystem"

export const [addConfigAnimationRepeatSystem] = configSystem(
    (self: AnimationManager) => {
        if (self.$action)
            self.$action.repetitions = self.animationStates.finishEvent
                ? 0
                : self.animationStates.repeat
    }
)
