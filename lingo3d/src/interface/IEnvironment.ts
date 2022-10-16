import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IEnvironment extends IPositioned {
    texture: Nullable<string | "studio" | "dynamic">
    helper: boolean
}

export const environmentSchema: Required<ExtractProps<IEnvironment>> = {
    ...positionedSchema,
    texture: String,
    helper: Boolean
}

export const environmentDefaults = extendDefaults<IEnvironment>(
    [positionedDefaults],
    { texture: "studio", helper: true }
)
