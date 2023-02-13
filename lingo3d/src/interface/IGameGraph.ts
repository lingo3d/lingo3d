import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type GameGraphNode = { x: number; y: number }
export type GameGraphConnection = {
    from: string
    to: string
    fromProp: string
    toProp: string
}

export type GameGraphData = Record<
    string, //uuid
    GameGraphNode | GameGraphConnection
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
