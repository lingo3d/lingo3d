import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import { ShadowDistance } from "../states/useShadowDistance"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import { shadowDistanceChoices } from "./IDirectionalLight"

export default interface ISkyLight extends ILightBase {
    groundColor: string
    shadowDistance: Nullable<ShadowDistance>
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    shadowDistance: String,
    groundColor: String
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [lightBaseDefaults],
    {
        groundColor: "#ffffff",
        shadowDistance: new NullableDefault("middle")
    },
    {
        shadowDistance: shadowDistanceChoices
    }
)
