import ISpotLight, { spotLightDefaults, spotLightSchema } from "./ISpotLight"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IPooledSpotLight extends ISpotLight {}

export const pooledSpotLightSchema: Required<ExtractProps<IPooledSpotLight>> = {
    ...spotLightSchema
}

export const pooledSpotLightDefaults = extendDefaults<IPooledSpotLight>(
    [spotLightDefaults],
    { fade: true }
)
