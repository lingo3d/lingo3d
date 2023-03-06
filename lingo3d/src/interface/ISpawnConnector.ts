import Appendable from "../api/core/Appendable"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ISpawnConnector extends IAppendable {
    from: Nullable<string | Appendable>
    to: Nullable<string | Appendable>
}

export const spawnConnectorSchema: Required<ExtractProps<ISpawnConnector>> = {
    ...appendableSchema,
    from: [String, Object],
    to: [String, Object]
}

export const spawnConnectorDefaults = extendDefaults<ISpawnConnector>(
    [appendableDefaults],
    {
        from: undefined,
        to: undefined
    }
)
