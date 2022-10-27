import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
    decay: number
    distance: number
    targetX: number
    targetY: number
    targetZ: number
}

export const spotLightSchema: Required<ExtractProps<ISpotLight>> = {
    ...lightBaseSchema,
    angle: Number,
    penumbra: Number,
    decay: Number,
    distance: Number,
    targetX: Number,
    targetY: Number,
    targetZ: Number
}

export const spotLightDefaults = extendDefaults<ISpotLight>(
    [lightBaseDefaults],
    {
        angle: 1,
        penumbra: 0,
        decay: 1,
        distance: 0,
        targetX: 0,
        targetY: 0,
        targetZ: 0
    }
)
