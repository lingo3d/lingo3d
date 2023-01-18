import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ID6Drive extends IAppendable {}

export const cylinderSchema: Required<ExtractProps<ID6Drive>> = {
    ...appendableSchema
}

export const cylinderDefaults = extendDefaults<ID6Drive>(
    [appendableDefaults],
    {}
)
