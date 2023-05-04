import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import getContext from "../../utilsCached/getContext"

export const [addConfigAnimationPlaybackSystem] = configSystemWithCleanUp(
    (self: AnimationManager) => {
        const action = self.$action
        if (!action) return

        const mixer = self.$mixer
        action.paused = self.paused || self.$pausedCount > 0
        if (action.paused) {
            if (self.$frame !== undefined) {
                action.paused = false
                action.play()
                mixer.setTime(
                    (action.time = self.$frame * INVERSE_STANDARD_FRAME)
                )
                self.$frame = undefined
                action.paused = true
            }
            return
        }

        const context = getContext(mixer) as {
            manager?: AnimationManager
        }
        const prevManager = context.manager
        context.manager = self
        if (prevManager && prevManager !== self) {
            prevManager.paused = true
            action.crossFadeFrom(prevManager.$action!, 0.25, true)
            if (self.$frame === undefined) action.time = 0
        }
        if (self.$frame !== undefined) {
            action.time = self.$frame * INVERSE_STANDARD_FRAME
            self.$frame = undefined
        }
        action.clampWhenFinished = true
        action.enabled = true
        action.play()
    }
)
