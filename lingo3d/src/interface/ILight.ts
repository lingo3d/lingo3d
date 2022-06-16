import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ILight extends ILightBase {}

export const lightSchema: Required<ExtractProps<ILight>> = {
    ...lightBaseSchema
}

export const lightDefaults: Defaults<ILight> = {
    ...lightBaseDefaults
}