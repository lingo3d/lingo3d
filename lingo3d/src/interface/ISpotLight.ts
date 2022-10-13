import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
    decay: number
    distance: number
}

export const spotLightSchema: Required<ExtractProps<ISpotLight>> = {
    ...lightBaseSchema,
    angle: Number,
    penumbra: Number,
    decay: Number,
    distance: Number
}

export const spotLightDefaults = extendDefaults<ISpotLight>([
    lightBaseDefaults,
    {
        angle: 1,
        penumbra: 0,
        decay: 1,
        distance: 0,
        castShadow: true
    }
])
