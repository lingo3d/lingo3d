import AnimatedObjectManager from "../display/core/AnimatedObjectManager"
import AnimationStates from "../display/core/AnimatedObjectManager/AnimationStates"
import computeOnce from "./utils/computeOnce"

export default computeOnce((_: AnimatedObjectManager) => new AnimationStates())
