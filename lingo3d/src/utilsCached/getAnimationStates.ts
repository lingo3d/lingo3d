import AnimatedObjectManager from "../display/core/AnimatedObjectManager"
import AnimationStates from "../display/core/AnimatedObjectManager/AnimationStates"
import computeOnce from "./utils/computeOnce"

export const getAnimationStates = computeOnce(
    (manager: AnimatedObjectManager) => new AnimationStates(manager)
)
