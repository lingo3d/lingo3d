import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface ITimeline extends IAppendable {}

export const timelineSchema: Required<ExtractProps<ITimeline>> = {
    ...appendableSchema
}

export const timelineDefaults = extendDefaults<ITimeline>(
    [appendableDefaults],
    {}
)
