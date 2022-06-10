import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"

export type FacadePreset = "city0" | "city1" | "ghetto0" | "ghetto1" | "ghetto2" | "industrial0" | "storefront0"

export default interface IBuilding extends IObjectManager {
    preset: FacadePreset
    repeatX: number
    repeatZ: number
}

export const buildingSchema: Required<ExtractProps<IBuilding>> = {
    ...objectManagerSchema,
    preset: String,
    repeatX: Number,
    repeatZ: Number
}

export const buildingDefaults: IBuilding = {
    ...objectManagerDefaults,
    preset: "industrial0",
    repeatX: 1,
    repeatZ: 1
}