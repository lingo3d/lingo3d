import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import preactStore from "../utils/preactStore"

export const [useScrollLeft] = preactStore(0)
export const [useFrameNum] = preactStore(1000)
export const [useAnimationManager, setAnimationManager] = preactStore<
    AnimationManager | undefined
>(undefined)
