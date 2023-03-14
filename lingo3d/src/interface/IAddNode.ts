import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { defaultMethod } from "./utils/DefaultMethod"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IAddNode extends IGameGraphChild {
    add: number
    out: number
    execute: Function
}

export const addNodeSchema: Required<ExtractProps<IAddNode>> = {
    ...gameGraphChildSchema,
    add: Number,
    out: Number,
    execute: Function
}

export const addNodeDefaults = extendDefaults<IAddNode>(
    [gameGraphChildDefaults],
    { add: 1, out: 0, execute: defaultMethod() }
)
