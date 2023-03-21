import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface IPointLight extends ILightBase {
    decay: number
    distance: number
}

export const pointLightSchema: Required<ExtractProps<IPointLight>> = {
    ...lightBaseSchema,
    decay: Number,
    distance: Number
}

export const lightDecayRange = new Range(0.1, 10)
export const lightDistanceRange = new Range(100, 10000)

export const pointLightDefaults = extendDefaults<IPointLight>(
    [lightBaseDefaults],
    { decay: 2, distance: 1000 },
    { decay: lightDecayRange, distance: lightDistanceRange }
)
