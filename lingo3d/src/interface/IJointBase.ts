import MeshAppendable from "../api/core/MeshAppendable"
import IPositionedDirectionedManager, {
    positionedDirectionedManagerDefaults,
    positionedDirectionedManagerSchema
} from "./IPositionedDirectionedManager"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IJointBase extends IPositionedDirectionedManager {
    from: Nullable<string | MeshAppendable>
    to: Nullable<string | MeshAppendable>
}

export const jointBaseSchema: Required<ExtractProps<IJointBase>> = {
    ...positionedDirectionedManagerSchema,
    from: [String, Object],
    to: [String, Object]
}

export const jointBaseDefaults = extendDefaults<IJointBase>(
    [positionedDirectionedManagerDefaults],
    {
        from: undefined,
        to: undefined
    }
)
