import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Choices from "./utils/Choices"

export type CastShadow = boolean | "physics"

export default interface IPointLight extends ILightBase {
    distance: number
    castShadow: CastShadow
}

export const pointLightSchema: Required<ExtractProps<IPointLight>> = {
    ...lightBaseSchema,
    distance: Number,
    castShadow: [Boolean, String]
}

export const lightDistanceRange = new Range(100, 2000)
export const castShadowChoices = new Choices({
    true: true,
    false: false,
    physics: "physics"
})

export const pointLightDefaults = extendDefaults<IPointLight>(
    [lightBaseDefaults],
    { distance: 1000, castShadow: false },
    {
        distance: lightDistanceRange,
        castShadow: castShadowChoices
    },
    { castShadow: true }
)
