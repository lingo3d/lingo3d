import Model from "../../display/Model"
import AnimatedObjectManager from "../../display/core/AnimatedObjectManager"
import { getAnimationStates } from "../../display/core/AnimatedObjectManager/AnimationStates"
import configLoadedSystemWithData from "../utils/configLoadedSystemWithData"

export const [addConfigAnimationManagerSystem] = configLoadedSystemWithData(
    (self: Model | AnimatedObjectManager, data: { name: string | number }) => {
        getAnimationStates(self).manager =
            typeof data.name === "string"
                ? self.animations[data.name]
                : Object.values(self.animations)[data.name]
    },
    (self) => !("$loadingCount" in self) || !self.$loadingCount
)
