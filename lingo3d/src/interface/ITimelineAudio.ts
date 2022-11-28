import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Nullable from "./utils/Nullable"

export default interface ITimelineAudio extends IAppendable {
    name: string
    src: Nullable<string>
    startFrame: number
}

export const timelineAudioSchema: Required<ExtractProps<ITimelineAudio>> = {
    ...appendableSchema,
    name: String,
    src: String,
    startFrame: Number
}

export const timelineAudioDefaults = extendDefaults<ITimelineAudio>(
    [appendableDefaults],
    { name: "", src: undefined, startFrame: 0 }
)
