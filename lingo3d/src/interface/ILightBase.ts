import { SHADOW_RESOLUTION } from "../globals"
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
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    helper: Boolean,
    color: String,
    intensity: Number,
    castShadow: Boolean,
    shadowResolution: Number
}

export const lightBaseDefaults = extendDefaults<ILightBase>(
    [
        objectManagerDefaults,
        {
            color: "#ffffff",
            intensity: 1,
            castShadow: false,
            shadowResolution: SHADOW_RESOLUTION,
            helper: true
        }
    ],
    {
        intensity: new Range(0, 10),
        shadowResolution: new Range(256, 2048, 256)
    }
)
