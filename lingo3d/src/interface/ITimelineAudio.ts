import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface ITimelineAudio extends IAppendable {}

export const timelineAudioSchema: Required<ExtractProps<ITimelineAudio>> = {
    ...appendableSchema
}

export const timelineAudioDefaults = extendDefaults<ITimelineAudio>(
    [appendableDefaults],
    {}
)
