import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface INumberNode extends IGameGraphChild {
    value: number
}

export const numberNodeSchema: Required<ExtractProps<INumberNode>> = {
    ...gameGraphChildSchema,
    value: Number
}

export const numberNodeDefaults = extendDefaults<INumberNode>(
    [gameGraphChildDefaults],
    { value: 0 }
)
