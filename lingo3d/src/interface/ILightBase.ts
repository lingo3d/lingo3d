import { SHADOW_BIAS, SHADOW_RESOLUTION } from "../globals"
import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    castShadow: boolean
    shadowResolution: number
    shadowBias: number
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

export const lightBaseDefaults = extendDefaults<ILightBase>(
    [
        objectManagerDefaults,
        {
            color: "#ffffff",
            intensity: 1,
            castShadow: false,
            shadowResolution: SHADOW_RESOLUTION,
            shadowBias: SHADOW_BIAS,
            helper: true
        }
    ],
    {
        intensity: new Range(0, 10),
        shadowResolution: new Range(256, 2048, 256)
    }
)
