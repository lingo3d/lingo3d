import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { defaultMethod } from "./utils/DefaultMethod"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IAddNode extends IGameGraphChild {
    value: number
    add: Function
    out: number
}

export const addNodeSchema: Required<ExtractProps<IAddNode>> = {
    ...gameGraphChildSchema,
    value: Number,
    add: Function,
    out: Number
}

export const addNodeDefaults = extendDefaults<IAddNode>(
    [gameGraphChildDefaults],
    { value: 1, add: defaultMethod(), out: 0 }
)
