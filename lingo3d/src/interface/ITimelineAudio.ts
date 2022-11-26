import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface ITimelineAudio extends IAppendable {
    name: string
    src?: string
}

export const timelineAudioSchema: Required<ExtractProps<ITimelineAudio>> = {
    ...appendableSchema,
    name: String,
    src: String
}

export const timelineAudioDefaults = extendDefaults<ITimelineAudio>(
    [appendableDefaults],
    { name: "", src: undefined }
)
