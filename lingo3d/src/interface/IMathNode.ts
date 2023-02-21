import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IMathNode extends IAppendable {}

export const mathNodeSchema: Required<ExtractProps<IMathNode>> = {
    ...appendableSchema
}

export const mathNodeDefaults = extendDefaults<IMathNode>(
    [appendableDefaults],
    {}
)
