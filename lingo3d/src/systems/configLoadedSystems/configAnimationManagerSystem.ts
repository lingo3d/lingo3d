import Model from "../../display/Model"
import AnimatedObjectManager from "../../display/core/AnimatedObjectManager"
import configLoadedSystemWithData from "../utils/configLoadedSystemWithData"

export const [addConfigAnimationManagerSystem] = configLoadedSystemWithData(
    (self: Model | AnimatedObjectManager, data: { name: string | number }) => {
        const { managerState } = self.$lazyStates()
        managerState.set(
            typeof data.name === "string"
                ? self.animations[data.name]
                : Object.values(self.animations)[data.name]
        )
    },
    (self) => !("$loadingCount" in self) || !self.$loadingCount
)
