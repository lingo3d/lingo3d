import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IProxyNode extends IAppendable {}

export const proxyNodeSchema: Required<ExtractProps<IProxyNode>> = {
    ...appendableSchema
}

export const proxyNodeDefaults = extendDefaults<IProxyNode>(
    [appendableDefaults],
    {}
)
