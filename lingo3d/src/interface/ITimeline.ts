import IAnimationManager, {
    animationManagerDefaults,
    animationManagerSchema
} from "./IAnimationManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ITimeline extends IAnimationManager {}

export const timelineSchema: Required<ExtractProps<ITimeline>> = {
    ...animationManagerSchema
}

export const timelineDefaults = extendDefaults<ITimeline>(
    [animationManagerDefaults],
    {}
)
