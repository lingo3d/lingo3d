import Appendable from "../api/core/Appendable"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { defaultMethod } from "./utils/DefaultMethod"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ISpawnNode extends IAppendable {
    source: Nullable<string>
    spawn: () => Appendable | undefined
}

export const spawnNodeSchema: Required<ExtractProps<ISpawnNode>> = {
    ...appendableSchema,
    source: String,
    spawn: Function
}

export const spawnNodeDefaults = extendDefaults<ISpawnNode>(
    [appendableDefaults],
    {
        source: undefined,
        spawn: defaultMethod(undefined)
    }
)
