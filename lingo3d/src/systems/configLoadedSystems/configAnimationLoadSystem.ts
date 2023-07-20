import isBusy from "../../api/isBusy"
import Model from "../../display/Model"
import AnimationManager from "../../display/core/AnimatedObjectManager/AnimationManager"
import { createLoadedEffectSystem } from "../utils/createLoadedEffectSystem"

export const configAnimationLoadSystem = createLoadedEffectSystem(
    "configAnimationLoadSystem",
    {
        data: { animations: [] as Array<AnimationManager> },
        effect: (self: Model, data) => {
            if (!self.$animationClips) return false

            for (const [name, clip] of Object.entries(self.$animationClips)) {
                const animation = (self.animations[name] = new AnimationManager(
                    name,
                    self.$loadedObject,
                    self.$animationStates
                ))
                animation.$clip = clip
                self.append(animation)
                data.animations.push(animation)
                if (name === self.animation) self.animation = name
            }
        },
        cleanup: (_, data) => {
            for (const animation of data.animations) animation.dispose()
            data.animations = []
        },
        loading: (self) => !self.$loadedObject || isBusy()
    }
)
