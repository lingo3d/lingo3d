import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { defaultMethod } from "./utils/DefaultMethod"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IAddNode extends IGameGraphChild {
    add: number
    value: number
    run: Function
}

export const addNodeSchema: Required<ExtractProps<IAddNode>> = {
    ...gameGraphChildSchema,
    add: Number,
    value: Number,
    run: Function
}

export const addNodeDefaults = extendDefaults<IAddNode>(
    [gameGraphChildDefaults],
    { add: 1, value: 0, run: defaultMethod() }
)
