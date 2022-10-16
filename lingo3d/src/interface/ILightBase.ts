import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Choices from "./utils/Choices"

export type ShadowResolution = "low" | "medium" | "high"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    castShadow: boolean
    shadowResolution: ShadowResolution
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    helper: Boolean,
    color: String,
    intensity: Number,
    castShadow: Boolean,
    shadowResolution: String
}

export const lightBaseDefaults = extendDefaults<ILightBase>(
    [
        objectManagerDefaults,
        {
            color: "#ffffff",
            intensity: 1,
            castShadow: false,
            shadowResolution: "medium",
            helper: true
        }
    ],
    {
        intensity: new Range(0, 10),
        shadowResolution: new Choices({
            low: "low",
            medium: "medium",
            high: "high"
        })
    }
)
