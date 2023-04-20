import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import IPointLightBase, {
    pointLightBaseDefaults,
    pointLightBaseSchema
} from "./IPointLightBase"

export default interface ISpotLight extends IPointLightBase {
    angle: number
    penumbra: number
    volumetric: boolean
    volumetricDistance: number
}

export const spotLightSchema: Required<ExtractProps<ISpotLight>> = {
    ...pointLightBaseSchema,
    angle: Number,
    penumbra: Number,
    volumetric: Boolean,
    volumetricDistance: Number
}

export const spotLightDefaults = extendDefaults<ISpotLight>(
    [pointLightBaseDefaults],
    {
        angle: 45,
        penumbra: 0.2,
        volumetric: false,
        volumetricDistance: 1
    },
    {
        angle: new Range(5, 180),
        penumbra: new Range(0, 1),
        volumetricDistance: new Range(0, 1)
    }
)
