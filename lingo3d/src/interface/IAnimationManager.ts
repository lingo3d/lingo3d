import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface IAimationManager extends IAppendable {
    paused: boolean
}

export const animationSchema: Required<ExtractProps<IAimationManager>> = {
    ...appendableSchema,
    paused: Boolean
}

export const animationDefaults = extendDefaults<IAimationManager>(
    [appendableDefaults],
    { paused: true }
)
