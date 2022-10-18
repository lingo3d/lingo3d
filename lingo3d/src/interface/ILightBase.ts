import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Choices from "./utils/Choices"
import { ShadowResolution } from "../states/useShadowResolution"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    castShadow: boolean
    shadowResolution: Nullable<ShadowResolution>
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

export const shadowResolutionChoices = new Choices({
    low: "low",
    medium: "medium",
    high: "high"
})
export const lightBaseDefaults = extendDefaults<ILightBase>(
    [objectManagerDefaults],
    {
        color: "#ffffff",
        intensity: 1,
        castShadow: false,
        shadowResolution: new NullableDefault("medium"),
        helper: true
    },
    {
        intensity: new Range(0, 2),
        shadowResolution: shadowResolutionChoices
    },
    { color: true, castShadow: true }
)
