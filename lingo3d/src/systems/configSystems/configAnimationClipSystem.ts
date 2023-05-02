import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { STANDARD_FRAME } from "../../globals"
import getClipAction from "../../utilsCached/getClipAction"
import configSystem from "../utils/configSystem"

export const [addConfigAnimationClipSystem] = configSystem(
    (self: AnimationManager) => {
        if (!self.$clip) {
            self.clipTotalFrames = 0
            return
        }
        self.clipTotalFrames = Math.ceil(self.$clip.duration * STANDARD_FRAME)
        self.actionState.set(getClipAction(self.$mixer, self.$clip))
    }
)
