import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import Nullable from "./utils/Nullable"

export type AnimationData = Record<
    string, //uuid
    Record<
        string, //property name
        Record<
            number, //frame number
            number //frame value
        >
    >
>

export default interface IAimationManager extends IAppendable {
    paused: boolean
    data: Nullable<AnimationData>
}

export const animationManagerSchema: Required<ExtractProps<IAimationManager>> =
    {
        ...appendableSchema,
        paused: Boolean,
        data: Object
    }

export const animationManagerDefaults = extendDefaults<IAimationManager>(
    [appendableDefaults],
    { paused: true, data: undefined }
)
