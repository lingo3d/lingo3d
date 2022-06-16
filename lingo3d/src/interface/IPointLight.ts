import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IPointLight extends ILightBase {
    decay: number
    distance: number
}

export const pointLightSchema: Required<ExtractProps<IPointLight>> = {
    ...lightBaseSchema,
    decay: Number,
    distance: Number
}

export const pointLightDefaults: Defaults<IPointLight> = {
    ...lightBaseDefaults,
    decay: 1,
    distance: 0
}