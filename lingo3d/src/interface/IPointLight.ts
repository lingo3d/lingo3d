import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"

export default interface IPointLight extends ILightBase {
    decay: number
    distance: number
    power: number
}

export const pointLightSchema: Required<ExtractProps<IPointLight>> = {
    ...lightBaseSchema,
    decay: Number,
    distance: Number,
    power: Number
}

export const pointLightDefaults: IPointLight = {
    ...lightBaseDefaults,
    decay: 1,
    distance: 0,
    power: 12.566
}