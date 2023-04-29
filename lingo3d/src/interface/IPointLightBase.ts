import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface IPointLightBase extends ILightBase {
    distance: number
    shadows: boolean
}

export const pointLightBaseSchema: Required<ExtractProps<IPointLightBase>> = {
    ...lightBaseSchema,
    distance: Number,
    shadows: Boolean
}

export const pointLightBaseDefaults = extendDefaults<IPointLightBase>(
    [lightBaseDefaults],
    { distance: 500, intensity: 10, shadows: true },
    { distance: new Range(100, 2000) }
)
