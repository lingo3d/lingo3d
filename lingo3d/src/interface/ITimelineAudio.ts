import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Nullable from "./utils/Nullable"

export default interface ITimelineAudio extends IAppendable {
    name: Nullable<string>
}

export const timelineAudioSchema: Required<ExtractProps<ITimelineAudio>> = {
    ...appendableSchema,
    name: String
}

export const timelineAudioDefaults = extendDefaults<ITimelineAudio>(
    [appendableDefaults],
    { name: undefined }
)
