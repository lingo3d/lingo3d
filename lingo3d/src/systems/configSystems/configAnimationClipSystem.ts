import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { STANDARD_FRAME } from "../../globals"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

export const [addConfigAnimationClipSystem] = configSystemWithCleanUp(
    (self: AnimationManager) => {
        const { clip } = self
        if (!clip) {
            self.clipTotalFrames = 0
            return
        }
        self.clipTotalFrames = Math.ceil(clip.duration * STANDARD_FRAME)

        const action = self.mixer.clipAction(clip)
        self.actionState.set(action)

        if (self.$frame !== undefined) {
            self.frame = self.$frame
            self.$frame = undefined
        }

        return () => {
            self.$frame = self.frame
            action.stop()
            action.enabled = false
            self.mixer.uncacheClip(clip)
        }
    }
)
