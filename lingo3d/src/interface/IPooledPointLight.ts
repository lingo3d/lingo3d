import IPointLight, {
    pointLightDefaults,
    pointLightSchema
} from "./IPointLight"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface IPooledPointLight extends IPointLight {}

export const pooledPointLightSchema: Required<ExtractProps<IPooledPointLight>> =
    { ...pointLightSchema }

export const pooledPointLightDefaults = extendDefaults<IPooledPointLight>(
    [pointLightDefaults],
    { fade: true }
)
