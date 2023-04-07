import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import { lightDistanceRange } from "./IPointLight"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
    distance: number
    volumetric: boolean
    volumetricDistance: number
}

export const spotLightSchema: Required<ExtractProps<ISpotLight>> = {
    ...lightBaseSchema,
    angle: Number,
    penumbra: Number,
    distance: Number,
    volumetric: Boolean,
    volumetricDistance: Number
}

export const spotLightDefaults = extendDefaults<ISpotLight>(
    [lightBaseDefaults],
    {
        angle: 45,
        penumbra: 0.2,
        distance: 1000,
        volumetric: false,
        volumetricDistance: 1
    },
    {
        angle: new Range(5, 180),
        penumbra: new Range(0, 1),
        distance: lightDistanceRange,
        volumetricDistance: new Range(0, 1)
    }
)
