import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IDirectionalLight extends ILightBase {}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    { ...lightBaseSchema }

export const directionalLightDefaults = extendDefaults<IDirectionalLight>(
    [lightBaseDefaults],
    {}
)
