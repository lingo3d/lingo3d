import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
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

export const spotLightDefaults: ISpotLight = {
    ...lightBaseDefaults,
    angle: 1,
    penumbra: 0
}