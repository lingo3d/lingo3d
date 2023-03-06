import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { defaultMethod } from "./utils/DefaultMethod"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISpawnNode extends IAppendable {
    spawn: () => void
}

export const spawnNodeSchema: Required<ExtractProps<ISpawnNode>> = {
    ...appendableSchema,
    spawn: Function
}

export const spawnNodeDefaults = extendDefaults<ISpawnNode>(
    [appendableDefaults],
    { spawn: defaultMethod() }
)
