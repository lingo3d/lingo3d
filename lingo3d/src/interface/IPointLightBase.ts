import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Choices from "./utils/Choices"

export type CastShadow = boolean | "physics"

export default interface IPointLightBase extends ILightBase {
    distance: number
    castShadow: CastShadow
}

export const pointLightBaseSchema: Required<ExtractProps<IPointLightBase>> = {
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

export const pointLightBaseDefaults = extendDefaults<IPointLightBase>(
    [lightBaseDefaults],
    { distance: 500, intensity: 10, castShadow: false },
    {
        distance: lightDistanceRange,
        castShadow: castShadowChoices
    },
    { castShadow: true }
)
