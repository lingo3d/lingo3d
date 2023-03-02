import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface IIncrementNode extends IAppendable {
    paused: boolean
    step: number
    initial: number
    min: number
    max: number
    output: number
}

export const incrementNodeSchema: Required<ExtractProps<IIncrementNode>> = {
    ...appendableSchema,
    paused: Boolean,
    step: Number,
    initial: Number,
    min: Number,
    max: Number,
    output: Number
}

export const incrementNodeDefaults = extendDefaults<IIncrementNode>(
    [appendableDefaults],
    {
        paused: false,
        step: 0,
        initial: 0,
        output: 0,
        min: -Infinity,
        max: Infinity
    },
    { step: new Range(0, 5, 1) }
)
