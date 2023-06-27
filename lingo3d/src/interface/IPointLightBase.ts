import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export const pointLightDistance = 500

export default interface IPointLightBase extends ILightBase {
    distance: number
    shadows: boolean
    fade: boolean
}

export const pointLightBaseSchema: Required<ExtractProps<IPointLightBase>> = {
    ...lightBaseSchema,
    distance: Number,
    shadows: Boolean,
    fade: Boolean
}

export const pointLightBaseDefaults = extendDefaults<IPointLightBase>(
    [lightBaseDefaults],
    {
        distance: pointLightDistance,
        intensity: 10,
        shadows: true,
        fade: false
    },
    { distance: new Range(100, 2000) }
)
