import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import AnimationStates from "../../display/core/AnimatedObjectManager/AnimationStates"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import getContext from "../../utilsCached/getContext"
import { addUpdateDTSystem, deleteUpdateDTSystem } from "../updateDTSystem"
import configSystem from "../utils/configSystem"

export const [addConfigAnimationPlaybackSystem] = configSystem(
    (animationStates: AnimationStates) => {
        const manager = animationStates.manager
        if (!manager) return

        const action = manager.$action
        if (!action) return

        const mixer = manager.$mixer
        action.paused = manager.paused || animationStates.pausedCount > 0
        if (action.paused) {
            if (animationStates.gotoFrame !== undefined) {
                action.paused = false
                action.play()
                mixer.setTime(
                    (action.time =
                        animationStates.gotoFrame * INVERSE_STANDARD_FRAME)
                )
                animationStates.gotoFrame = undefined
                action.paused = true
            }
            return
        }

        const context = getContext(mixer) as {
            manager?: AnimationManager
            playCount?: number
        }
        const prevManager = context.manager
        context.manager = manager
        if (prevManager && prevManager !== manager) {
            action.crossFadeFrom(prevManager.$action!, 0.25, true)
            if (animationStates.gotoFrame === undefined) {
                action.time = 0
            }
        }
        if (animationStates.gotoFrame !== undefined) {
            action.time = animationStates.gotoFrame * INVERSE_STANDARD_FRAME
            animationStates.gotoFrame = undefined
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
