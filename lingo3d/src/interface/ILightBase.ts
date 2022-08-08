import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    shadowResolution: Nullable<number>
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    color: String,
    intensity: Number,
    shadowResolution: Number,
    helper: Boolean
}

export const lightBaseDefaults: Defaults<ILightBase> = {
    ...objectManagerDefaults,
    color: "#ffffff",
    intensity: 1,
    shadowResolution: [undefined, 512],
    helper: true
}
