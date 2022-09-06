import { WATERNORMALS_URL } from "../globals"
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
    resolution: number
    speed: number
}

export const waterSchema: Required<ExtractProps<IWater>> = {
    ...objectManagerSchema,
    shape: String,
    normalMap: String,
    resolution: Number,
    speed: Number
}

export const waterDefaults: Defaults<IWater> = {
    ...objectManagerDefaults,
    shape: "plane",
    normalMap: WATERNORMALS_URL,
    resolution: 512,
    speed: 1
}
