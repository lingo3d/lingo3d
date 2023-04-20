import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IPointLightBase, {
    pointLightBaseDefaults,
    pointLightBaseSchema
} from "./IPointLightBase"

export default interface IPointLight extends IPointLightBase {}

export const pointLightSchema: Required<ExtractProps<IPointLight>> = {
    ...pointLightBaseSchema
}

export const pointLightDefaults = extendDefaults<IPointLight>(
    [pointLightBaseDefaults],
    {}
)
