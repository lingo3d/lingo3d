import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface IAimationManager extends IAppendable {
    paused: boolean
}

export const animationManagerSchema: Required<ExtractProps<IAimationManager>> =
    {
        ...appendableSchema,
        paused: Boolean
    }

export const animationManagerDefaults = extendDefaults<IAimationManager>(
    [appendableDefaults],
    { paused: true }
)
