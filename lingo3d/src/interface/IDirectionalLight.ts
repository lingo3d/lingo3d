import ILight, { lightDefaults, lightSchema } from "./ILight"
import { ExtractProps } from "./utils/extractProps"

export default interface IDirectionalLight extends ILight {}

export const directinalLightSchema: Required<ExtractProps<IDirectionalLight>> = {
    ...lightSchema
}

export const directionalLightDefaults: IDirectionalLight = {
    ...lightDefaults
}