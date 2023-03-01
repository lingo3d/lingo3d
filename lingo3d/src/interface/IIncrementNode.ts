import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IIncrementNode extends IAppendable {
    initial: number
    amount: number
    output: number
}

export const incrementNodeSchema: Required<ExtractProps<IIncrementNode>> = {
    ...appendableSchema,
    initial: Number,
    amount: Number,
    output: Number
}

export const incrementNodeDefaults = extendDefaults<IIncrementNode>(
    [appendableDefaults],
    { initial: 0, amount: 0, output: 0 }
)
