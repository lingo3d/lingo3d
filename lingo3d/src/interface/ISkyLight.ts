import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISkyLight extends ILightBase {
    groundColor: string
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    groundColor: String
}

export const skyLightDefaults: Defaults<ISkyLight> = {
    ...lightBaseDefaults,
    groundColor: "#ffffff"
}