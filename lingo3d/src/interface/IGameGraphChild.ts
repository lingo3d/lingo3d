import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IGameGraphChild extends IAppendable {
    isTemplate: boolean
}

export const gameGraphChildSchema: Required<ExtractProps<IGameGraphChild>> = {
    ...appendableSchema,
    isTemplate: Boolean
}

export const gameGraphChildDefaults = extendDefaults<IGameGraphChild>(
    [appendableDefaults],
    { isTemplate: false }
)
