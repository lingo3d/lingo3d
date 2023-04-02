import PhysicsObjectManager from "../display/core/PhysicsObjectManager"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IJointBase extends IMeshAppendable {
    from: Nullable<string | PhysicsObjectManager>
    to: Nullable<string | PhysicsObjectManager>
}

export const jointBaseSchema: Required<ExtractProps<IJointBase>> = {
    ...meshAppendableSchema,
    from: [String, Object],
    to: [String, Object]
}

export const jointBaseDefaults = extendDefaults<IJointBase>(
    [meshAppendableDefaults],
    {
        from: undefined,
        to: undefined
    }
)
