import { AnimationMixer } from "three"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { addUpdateDTSystem, deleteUpdateDTSystem } from "../updateDTSystem"

const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()
const mixerPlayCountMap = new WeakMap<AnimationMixer, number>()

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

        const prevManager = mixerManagerMap.get(mixer)
        mixerManagerMap.set(mixer, self)
        if (prevManager && prevManager !== self) {
            prevManager.paused = true
            prevManager.$action &&
                action.crossFadeFrom(prevManager.$action, 0.25, true)
        }

        action.clampWhenFinished = true
        action.enabled = true
        action.play()

        const playCount = (mixerPlayCountMap.get(mixer) ?? 0) + 1
        mixerPlayCountMap.set(mixer, playCount)
        playCount === 1 && addUpdateDTSystem(mixer)
        return () => {
            const playCount = mixerPlayCountMap.get(mixer)! - 1
            mixerPlayCountMap.set(mixer, playCount)
            playCount === 0 && deleteUpdateDTSystem(mixer)
        }
    }
)
