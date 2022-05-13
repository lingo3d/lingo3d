import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"

export default interface IAreaLight extends ILightBase {
    power: number
    helper: boolean
}

export const areaLightSchema: Required<ExtractProps<IAreaLight>> = {
    ...lightBaseSchema,
    power: Number,
    helper: Boolean
}

export const areaLightDefaults: IAreaLight = {
    ...lightBaseDefaults,
    depth: 0,
    scaleZ: 0,
    power: 10 * Math.PI,
    helper: true
}