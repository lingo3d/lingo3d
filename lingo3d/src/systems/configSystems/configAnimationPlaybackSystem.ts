import { AnimationMixer, AnimationAction } from "three"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { onBeforeRender } from "../../events/onBeforeRender"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import { dtPtr } from "../../pointers/dtPtr"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()

export const [addConfigAnimationPlaybackSystem] = configSystemWithCleanUp(
    (self: AnimationManager) => {
        const action = self.$action
        if (!action) return

        const gotoFrame = self.$frame
        if (
            (action.paused =
                (self.paused || !!self.delay) && gotoFrame === undefined)
        )
            return

        const prevManager = mixerManagerMap.get(self.$mixer)
        mixerManagerMap.set(self.$mixer, self)
        if (prevManager && prevManager !== self) prevManager.paused = true

        const prevAction = mixerActionMap.get(self.$mixer)
        mixerActionMap.set(self.$mixer, action)
        if (prevAction && action !== prevAction)
            action.crossFadeFrom(prevAction, 0.25, true)

        action.clampWhenFinished = true
        action.enabled = true
        action.play()

        if (gotoFrame !== undefined) {
            if (prevManager && prevManager !== self)
                action.time = gotoFrame * INVERSE_STANDARD_FRAME
            else self.$mixer.setTime(gotoFrame * INVERSE_STANDARD_FRAME)
            self.$frame = undefined
            return
        }
        const handle = onBeforeRender(() => self.$mixer.update(dtPtr[0]))
        return () => {
            handle.cancel()
        }
    }
)
