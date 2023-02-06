import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"

export default interface IMeshAppendable extends IAppendable {
    name: string
}

export const meshAppendableSchema: Required<ExtractProps<IMeshAppendable>> = {
    ...appendableSchema,
    name: String
}

export const meshAppendableDefaults = extendDefaults<IMeshAppendable>(
    [appendableDefaults],
    { name: "" }
)
