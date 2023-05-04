import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { addUpdateDTSystem, deleteUpdateDTSystem } from "../updateDTSystem"
import getContext from "../../utilsCached/getContext"

export const [addConfigAnimationPlaybackSystem] = configSystemWithCleanUp(
    (self: AnimationManager) => {
        const action = self.$action
        if (!action) return

        const gotoFrame = self.$frame
        const mixer = self.$mixer
        if (gotoFrame !== undefined) {
            action.paused = false
            action.time = gotoFrame * INVERSE_STANDARD_FRAME
            action.play()
            mixer.setTime(action.time)
            self.$frame = undefined
            return
        }

        action.paused = self.paused || !!self.delay
        if (action.paused) return

        const context = getContext(mixer) as {
            manager?: AnimationManager
            playCount?: number
        }
        const prevManager = context.manager
        context.manager = self
        if (prevManager && prevManager !== self) {
            prevManager.paused = true
            prevManager.$action &&
                action.crossFadeFrom(prevManager.$action, 0.25, true)
        }

        action.clampWhenFinished = true
        action.enabled = true
        action.play()

        context.playCount = (context.playCount ?? 0) + 1
        context.playCount === 1 && addUpdateDTSystem(mixer)
        return () => {
            context.playCount = context.playCount! - 1
            context.playCount === 0 && deleteUpdateDTSystem(mixer)
        }
    }
)
