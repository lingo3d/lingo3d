import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export default interface IWater extends IObjectManager {
    shape: "plane" | "sphere"
    normalMap: Nullable<string>
}

export const waterSchema: Required<ExtractProps<IWater>> = {
    ...objectManagerSchema,
    shape: String,
    normalMap: String
}

export const waterDefaults: Defaults<IWater> = {
    ...objectManagerDefaults,
    shape: "plane",
    normalMap: undefined
}
