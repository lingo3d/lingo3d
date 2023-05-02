import AnimationStates from "../../display/core/AnimatedObjectManager/AnimationStates"
import configSystem from "../utils/configSystem"
import { addConfigAnimationFinishSystem } from "./configAnimationFinishSystem"
import { addConfigAnimationRepeatSystem } from "./configAnimationRepeatSystem"

export const [addConfigAnimationStatesSystem] = configSystem(
    (self: AnimationStates) => {
        if (self.manager) self.manager.paused = self.paused

        for (const manager of Object.values(self.managerRecord)) {
            addConfigAnimationFinishSystem(manager)
            addConfigAnimationRepeatSystem(manager)
        }
    }
)
