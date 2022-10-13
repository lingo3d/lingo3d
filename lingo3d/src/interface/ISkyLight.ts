import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISkyLight extends ILightBase {
    groundColor: string
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    groundColor: String
}

export const skyLightDefaults = extendDefaults<ISkyLight>([
    lightBaseDefaults,
    { groundColor: "#ffffff" }
])
