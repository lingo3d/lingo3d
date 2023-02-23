import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IMathNode extends IAppendable {
    expression: Nullable<string>
}

export const mathNodeSchema: Required<ExtractProps<IMathNode>> = {
    ...appendableSchema,
    expression: String
}

export const mathNodeDefaults = extendDefaults<IMathNode>(
    [appendableDefaults],
    { expression: undefined }
)
