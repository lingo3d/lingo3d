import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"

export default interface IAreaLight extends ILightBase {
    power: number
}

export const areaLightSchema: Required<ExtractProps<IAreaLight>> = {
    ...lightBaseSchema,
    power: Number
}

export const areaLightDefaults: IAreaLight = {
    ...lightBaseDefaults,
    width: 1000,
    height: 1000,
    depth: 0,
    scaleZ: 0,
    power: 10 * Math.PI
}