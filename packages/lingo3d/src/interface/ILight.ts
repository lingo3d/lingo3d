import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"

export default interface ILight extends ILightBase {}

export const lightSchema: Required<ExtractProps<ILight>> = {
    ...lightBaseSchema
}

export const lightDefaults: ILight = {
    ...lightBaseDefaults
}