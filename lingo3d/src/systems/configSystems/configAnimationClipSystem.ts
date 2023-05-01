import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { STANDARD_FRAME } from "../../globals"
import getClipAction from "../../utilsCached/getClipAction"
import configSystem from "../utils/configSystem"

export const [addConfigAnimationClipSystem] = configSystem(
    (self: AnimationManager) => {
        const { clip } = self
        if (!clip) {
            self.clipTotalFrames = 0
            return
        }
        self.clipTotalFrames = Math.ceil(clip.duration * STANDARD_FRAME)
        self.actionState.set(getClipAction(self.mixer, clip))
    }
)
