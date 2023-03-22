import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import { lightDecayRange, lightDistanceRange } from "./IPointLight"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
    decay: number
    distance: number
    volumetric: boolean
}

export const spotLightSchema: Required<ExtractProps<ISpotLight>> = {
    ...lightBaseSchema,
    angle: Number,
    penumbra: Number,
    decay: Number,
    distance: Number,
    volumetric: Boolean
}

export const spotLightDefaults = extendDefaults<ISpotLight>(
    [lightBaseDefaults],
    {
        angle: 45,
        penumbra: 0.2,
        decay: 2,
        distance: 1000,
        volumetric: false
    },
    {
        angle: new Range(5, 180),
        penumbra: new Range(0, 1),
        decay: lightDecayRange,
        distance: lightDistanceRange
    }
)
