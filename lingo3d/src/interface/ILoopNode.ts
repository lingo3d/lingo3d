import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ILoopNode extends IGameGraphChild {}

export const loopNodeSchema: Required<ExtractProps<ILoopNode>> = {
    ...gameGraphChildSchema
}

export const loopNodeDefaults = extendDefaults<ILoopNode>(
    [gameGraphChildDefaults],
    {}
)
