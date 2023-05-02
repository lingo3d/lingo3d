import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

export const [addConfigAnimationFinishSystem] = configSystemWithCleanUp(
    (self: AnimationManager) => {
        if (self.paused) return

        const { finishEvent } = self.animationStates
        if (finishEvent) {
            const [emitFinish] = finishEvent
            const onFinish = () => emitFinish()
            self.$mixer.addEventListener("finished", onFinish)
            return () => {
                self.$mixer.removeEventListener("finished", onFinish)
            }
        }
        const { onFinish } = self.animationStates
        if (!onFinish) return

        self.$mixer.addEventListener("finished", onFinish)
        return () => {
            self.$mixer.removeEventListener("finished", onFinish)
        }
    }
)
