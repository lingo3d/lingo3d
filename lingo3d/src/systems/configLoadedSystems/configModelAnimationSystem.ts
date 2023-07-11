import Model from "../../display/Model"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configModelAnimationSystem = createLoadedEffectSystem(
    "configModelAnimationSystem",
    {
        data: { animations: undefined as any as Array<AnimationManager> },
        effect: (self: Model, data) => {
            const clips = self.$animationClips
            if (!clips) return false

            data.animations = clips.map((clip) => {
                const animation = (self.animations[clip.name] =
                    new AnimationManager(
                        clip.name,
                        self.$loadedObject,
                        self.$animationStates
                    ))
                animation.$clip = clip
                self.append(animation)
                return animation
            })
        },
        cleanup: (_, data) => {
            for (const animation of data.animations) animation.dispose()
        }
    }
)
