import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IPointLight extends ILightBase {
    decay: number
    distance: number
}

export const pointLightSchema: Required<ExtractProps<IPointLight>> = {
    ...lightBaseSchema,
    decay: Number,
    distance: Number
}

export const pointLightDefaults = extendDefaults<IPointLight>(
    [lightBaseDefaults],
    { decay: 1, distance: 0 }
)
