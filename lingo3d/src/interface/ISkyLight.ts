import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import { ShadowDistance } from "../states/useShadowDistance"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import { shadowDistanceChoices } from "./IDirectionalLight"
import Range from "./utils/Range"

export default interface ISkyLight extends ILightBase {
    groundColor: string
    shadowDistance: Nullable<ShadowDistance>
    ambientIntensity: number
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    shadowDistance: String,
    groundColor: String,
    ambientIntensity: Number
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [lightBaseDefaults],
    {
        groundColor: "#ffffff",
        shadowDistance: nullableDefault("medium"),
        intensity: 0.5,
        ambientIntensity: 0.5
    },
    {
        shadowDistance: shadowDistanceChoices,
        ambientIntensity: new Range(0, 2)
    }
)
