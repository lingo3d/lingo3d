import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISpotLight extends ILightBase {
    angle: number
    penumbra: number
}

export const spotLightSchema: Required<ExtractProps<ISpotLight>> = {
    ...lightBaseSchema,
    angle: Number,
    penumbra: Number
}

export const spotLightDefaults: Defaults<ISpotLight> = {
    ...lightBaseDefaults,
    angle: 1,
    penumbra: 0
}