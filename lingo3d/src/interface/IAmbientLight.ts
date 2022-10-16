import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IAmbientLight extends ILightBase {}

export const ambientLightSchema: Required<ExtractProps<IAmbientLight>> = {
    ...lightBaseSchema
}

export const ambientLightDefaults = extendDefaults<IAmbientLight>(
    [lightBaseDefaults],
    {}
)
