import Appendable from "../api/core/Appendable"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IConnector extends IAppendable {
    from: Nullable<string | Appendable>
    to: Nullable<string | Appendable>
    fromProp: Nullable<string>
    toProp: Nullable<string>
    xyz: Nullable<"x" | "y" | "z">
    type: Nullable<"spawn">
}

export const connectorSchema: Required<ExtractProps<IConnector>> = {
    ...appendableSchema,
    from: [String, Object],
    to: [String, Object],
    fromProp: String,
    toProp: String,
    xyz: String,
    type: String
}

export const connectorDefaults = extendDefaults<IConnector>(
    [appendableDefaults],
    {
        from: undefined,
        to: undefined,
        fromProp: undefined,
        toProp: undefined,
        xyz: undefined,
        type: undefined
    }
)
