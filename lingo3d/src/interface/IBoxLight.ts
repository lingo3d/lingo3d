import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"

export default interface IBoxLight extends ILightBase {
    helper: boolean
}

export const boxLightSchema: Required<ExtractProps<IBoxLight>> = {
    ...lightBaseSchema,
    helper: Boolean
}

export const boxLightDefaults: IBoxLight = {
    ...lightBaseDefaults,
    helper: true,
    intensity: 3
}