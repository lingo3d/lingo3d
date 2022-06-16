import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    color: String,
    intensity: Number
}

export const lightBaseDefaults: Defaults<ILightBase> = {
    ...objectManagerDefaults,
    color: "#ffffff",
    intensity: 1
}