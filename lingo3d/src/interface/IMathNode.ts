import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"

export default interface IMathNode extends IAppendable {
    expression: Nullable<string>
    output: Nullable<number>
}

export const mathNodeSchema: Required<ExtractProps<IMathNode>> = {
    ...appendableSchema,
    expression: String,
    output: Number
}

export const mathNodeDefaults = extendDefaults<IMathNode>(
    [appendableDefaults],
    { expression: undefined, output: nullableDefault(0) }
)
