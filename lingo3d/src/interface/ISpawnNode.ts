import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { defaultMethod } from "./utils/DefaultMethod"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISpawnNode extends IGameGraphChild {
    spawn: () => void
}

export const spawnNodeSchema: Required<ExtractProps<ISpawnNode>> = {
    ...gameGraphChildSchema,
    spawn: Function
}

export const spawnNodeDefaults = extendDefaults<ISpawnNode>(
    [gameGraphChildDefaults],
    { spawn: defaultMethod() }
)
