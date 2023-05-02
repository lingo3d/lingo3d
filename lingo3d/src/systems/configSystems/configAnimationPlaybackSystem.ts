import { AnimationMixer, AnimationAction } from "three"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"
import { addUpdateDTSystem, deleteUpdateDTSystem } from "../updateDTSystem"

const mixerActionMap = new WeakMap<AnimationMixer, AnimationAction>()
const mixerManagerMap = new WeakMap<AnimationMixer, AnimationManager>()
const mixerPlayCountMap = new WeakMap<AnimationMixer, number>()

export const [addConfigAnimationPlaybackSystem] = configSystemWithCleanUp(
    (self: AnimationManager) => {
        const action = self.$action
        if (!action) return

        const gotoFrame = self.$frame
        action.paused = (self.paused || !!self.delay) && gotoFrame === undefined
        if (action.paused) return

        const mixer = self.$mixer
        if (gotoFrame !== undefined) {
            mixer.setTime(gotoFrame * INVERSE_STANDARD_FRAME)
            self.$frame = undefined
            return
        }

        const prevManager = mixerManagerMap.get(mixer)
        mixerManagerMap.set(mixer, self)
        if (prevManager && prevManager !== self) prevManager.paused = true

        const prevAction = mixerActionMap.get(mixer)
        mixerActionMap.set(mixer, action)
        if (prevAction && action !== prevAction)
            action.crossFadeFrom(prevAction, 0.25, true)

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
