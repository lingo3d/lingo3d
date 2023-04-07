import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Choices from "./utils/Choices"

export type CastShadow = boolean | "physics"

export default interface IPointLight extends ILightBase {
    decay: number
    distance: number
    castShadow: CastShadow
}

export const pointLightSchema: Required<ExtractProps<IPointLight>> = {
    ...lightBaseSchema,
    decay: Number,
    distance: Number,
    castShadow: [Boolean, String]
}

export const lightDecayRange = new Range(0.1, 10)
export const lightDistanceRange = new Range(100, 2000)

export const pointLightDefaults = extendDefaults<IPointLight>(
    [lightBaseDefaults],
    { decay: 2, distance: 1000, castShadow: false },
    {
        decay: lightDecayRange,
        distance: lightDistanceRange,
        castShadow: new Choices({
            true: true,
            false: false,
            physics: "physics"
        })
    },
    { castShadow: true }
)
