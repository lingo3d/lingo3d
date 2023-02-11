import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type GameGraphData = Record<
    string, //uuid
    { x: number; y: number }
>

export default interface IGameGraph extends IAppendable {
    paused: boolean
}

export const gameGraphSchema: Required<ExtractProps<IGameGraph>> = {
    ...appendableSchema,
    paused: Boolean
}

export const gameGraphDefaults = extendDefaults<IGameGraph>(
    [appendableDefaults],
    { paused: false }
)
