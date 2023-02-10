import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface IMeshAppendable extends IAppendable {}

export const meshAppendableSchema: Required<ExtractProps<IMeshAppendable>> = {
    ...appendableSchema
}

export const meshAppendableDefaults = extendDefaults<IMeshAppendable>(
    [appendableDefaults],
    {}
)
