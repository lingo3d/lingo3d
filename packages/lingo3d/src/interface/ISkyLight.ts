import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"

export default interface ISkyLight extends ILightBase {
    groundColor: string
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    groundColor: String
}

export const skyLightDefaults: ISkyLight = {
    ...lightBaseDefaults,
    groundColor: "#ffffff"
}