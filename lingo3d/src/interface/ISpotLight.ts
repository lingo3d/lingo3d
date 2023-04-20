import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import {
    CastShadow,
    castShadowChoices,
    lightDistanceRange
} from "./IPointLight"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
    distance: number
    castShadow: CastShadow
    volumetric: boolean
    volumetricDistance: number
}

export const spotLightSchema: Required<ExtractProps<ISpotLight>> = {
    ...lightBaseSchema,
    angle: Number,
    penumbra: Number,
    distance: Number,
    castShadow: [Boolean, String],
    volumetric: Boolean,
    volumetricDistance: Number
}

export const spotLightDefaults = extendDefaults<ISpotLight>(
    [lightBaseDefaults],
    {
        angle: 45,
        penumbra: 0.2,
        distance: 500,
        castShadow: false,
        volumetric: false,
        volumetricDistance: 1
    },
    {
        angle: new Range(5, 180),
        penumbra: new Range(0, 1),
        distance: lightDistanceRange,
        castShadow: castShadowChoices,
        volumetricDistance: new Range(0, 1)
    },
    { castShadow: true }
)
