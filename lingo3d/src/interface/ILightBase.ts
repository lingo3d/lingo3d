import { SHADOW_BIAS } from "../globals"
import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import { extendDefaults } from "./utils/Defaults"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    castShadow: boolean
    shadowResolution: Nullable<number>
    shadowBias: Nullable<number>
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    color: String,
    intensity: Number,
    castShadow: Boolean,
    shadowResolution: Number,
    shadowBias: Number,
    helper: Boolean
}

export const lightBaseDefaults = extendDefaults<ILightBase>([
    objectManagerDefaults,
    {
        color: "#ffffff",
        intensity: 1,
        castShadow: false,
        shadowResolution: new NullableDefault(256),
        shadowBias: new NullableDefault(SHADOW_BIAS),
        helper: true
    }
])
