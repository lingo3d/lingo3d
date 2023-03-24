import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IAreaLight extends ILightBase {}

export const areaLightSchema: Required<ExtractProps<IAreaLight>> = {
    ...lightBaseSchema
}

export const areaLightDefaults = extendDefaults<IAreaLight>(
    [lightBaseDefaults],
    { depth: 0, scaleZ: 0 }
)
