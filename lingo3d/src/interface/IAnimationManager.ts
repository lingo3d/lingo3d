import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { AnimationData } from "../api/serializer/types"
import Nullable from "./utils/Nullable"

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
