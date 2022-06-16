import ILight, { lightDefaults, lightSchema } from "./ILight"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IAmbientLight extends ILight {}

export const ambientLightSchema: Required<ExtractProps<IAmbientLight>> = {
    ...lightSchema
}

export const ambientLightDefaults: Defaults<IAmbientLight> = {
    ...lightDefaults
}