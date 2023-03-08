import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface IIncrementNode extends IGameGraphChild {
    paused: boolean
    step: number
    initial: number
    min: number
    max: number
    out: number
}

export const incrementNodeSchema: Required<ExtractProps<IIncrementNode>> = {
    ...gameGraphChildSchema,
    paused: Boolean,
    step: Number,
    initial: Number,
    min: Number,
    max: Number,
    out: Number
}

export const incrementNodeDefaults = extendDefaults<IIncrementNode>(
    [gameGraphChildDefaults],
    {
        paused: false,
        step: 0,
        initial: 0,
        out: 0,
        min: -Infinity,
        max: Infinity
    },
    { step: new Range(0, 5, 1) }
)
