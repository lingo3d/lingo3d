import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IMathNode extends IGameGraphChild {
    expression: Nullable<string>
}

export const mathNodeSchema: Required<ExtractProps<IMathNode>> = {
    ...gameGraphChildSchema,
    expression: String
}

export const mathNodeDefaults = extendDefaults<IMathNode>(
    [gameGraphChildDefaults],
    { expression: undefined }
)
