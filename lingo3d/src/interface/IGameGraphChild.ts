import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IGameGraphChild extends IAppendable {}

export const gameGraphChildSchema: Required<ExtractProps<IGameGraphChild>> = {
    ...appendableSchema
}

export const gameGraphChildDefaults = extendDefaults<IGameGraphChild>(
    [appendableDefaults],
    {}
)
