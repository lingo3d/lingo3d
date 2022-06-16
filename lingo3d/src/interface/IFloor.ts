import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type FacadePreset = "city0" | "city1" | "ghetto0" | "ghetto1" | "ghetto2" | "industrial0" | "storefront0"

export default interface IFloor extends IObjectManager {
    preset: FacadePreset
    repeatX: number
    repeatZ: number
}

export const floorSchema: Required<ExtractProps<IFloor>> = {
    ...objectManagerSchema,
    preset: String,
    repeatX: Number,
    repeatZ: Number
}

export const floorDefaults: Defaults<IFloor> = {
    ...objectManagerDefaults,
    preset: "industrial0",
    repeatX: 1,
    repeatZ: 1
}