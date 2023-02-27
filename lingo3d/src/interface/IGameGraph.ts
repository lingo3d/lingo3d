import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export type GameGraphNode = { x: number; y: number }

export type GameGraphData = Record<
    string, //uuid
    GameGraphNode | { type: "connector" }
>

export default interface IGameGraph extends IAppendable {
    paused: boolean
    data: Nullable<GameGraphData>
}

export const gameGraphSchema: Required<ExtractProps<IGameGraph>> = {
    ...appendableSchema,
    paused: Boolean,
    data: Object
}

export const gameGraphDefaults = extendDefaults<IGameGraph>(
    [appendableDefaults],
    { paused: false, data: undefined }
)
