import { LoopRepeat } from "three"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import AnimationStates from "../../display/core/AnimatedObjectManager/AnimationStates"
import { INVERSE_STANDARD_FRAME } from "../../globals"
import getContext from "../../memo/getContext"
import { updateDTSystem } from "../updateDTSystem"
import createInternalSystem from "../utils/createInternalSystem"
import { onAfterRender } from "../../events/onAfterRender"

export const configAnimationPlaybackSystem = createInternalSystem(
    "configAnimationPlaybackSystem",
    {
        effect: (self: AnimationStates) => {
            const manager = self.manager
            if (!manager) return false

            const action = manager.$action
            if (!action) return false

            const mixer = manager.$mixer
            action.paused = manager.paused || self.pausedCount > 0

            if (action.paused) {
                if (self.gotoFrame !== undefined) {
                    action.paused = false
                    action.play()
                    mixer.setTime(
                        (action.time = self.gotoFrame * INVERSE_STANDARD_FRAME)
                    )
                    self.gotoFrame = undefined
                    action.paused = true
                }
                return false
            }

            const context = getContext(mixer) as {
                manager?: AnimationManager
                playCount?: number
            }
            const prevManager = context.manager
            context.manager = manager
            if (prevManager && prevManager !== manager) {
                action.crossFadeFrom(prevManager.$action!, 0.25, true)
                if (self.gotoFrame === undefined) action.time = 0
            }
            if (self.gotoFrame !== undefined) {
                action.time = self.gotoFrame * INVERSE_STANDARD_FRAME
                self.gotoFrame = undefined
            }
            if (typeof self.loop === "number")
                action.setLoop(LoopRepeat, self.loop)
            else action.setLoop(LoopRepeat, self.loop ? Infinity : 0)

            action.clampWhenFinished = true
            action.enabled = true
            action.play()

            context.playCount = (context.playCount ?? 0) + 1
            context.playCount === 1 && updateDTSystem.add(mixer)
        },
        cleanup: (self) => {
            const mixer = self.manager!.$mixer
            const context = getContext(mixer) as {
                manager?: AnimationManager
                playCount?: number
            }
            context.playCount = context.playCount! - 1
            context.playCount === 0 && updateDTSystem.delete(mixer)
        },
        effectTicker: onAfterRender
    }
)
