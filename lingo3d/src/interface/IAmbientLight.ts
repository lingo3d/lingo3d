import ILight, { lightDefaults, lightSchema } from "./ILight"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IAmbientLight extends ILight {}

export const ambientLightSchema: Required<ExtractProps<IAmbientLight>> = {
    ...lightSchema
}

export const ambientLightDefaults = extendDefaults<IAmbientLight>([
    lightDefaults
])
