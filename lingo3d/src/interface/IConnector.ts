import IGameGraphChild, {
    gameGraphChildDefaults,
    gameGraphChildSchema
} from "./IGameGraphChild"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IConnector extends IGameGraphChild {
    from: Nullable<string>
    to: Nullable<string>
    fromProp: Nullable<string>
    toProp: Nullable<string>
    xyz: Nullable<"x" | "y" | "z">
}

export const connectorSchema: Required<ExtractProps<IConnector>> = {
    ...gameGraphChildSchema,
    from: String,
    to: String,
    fromProp: String,
    toProp: String,
    xyz: String
}

export const connectorDefaults = extendDefaults<IConnector>(
    [gameGraphChildDefaults],
    {
        from: undefined,
        to: undefined,
        fromProp: undefined,
        toProp: undefined,
        xyz: undefined
    }
)
