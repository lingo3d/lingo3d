import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export type FacadePreset =
    | "city0"
    | "city1"
    | "ghetto0"
    | "ghetto1"
    | "ghetto2"
    | "industrial0"
    | "storefront0"

export default interface IFloor extends IVisibleObjectManager {
    preset: FacadePreset
    repeatX: number
    repeatZ: number
}

export const floorSchema: Required<ExtractProps<IFloor>> = {
    ...visibleObjectManagerSchema,
    preset: String,
    repeatX: Number,
    repeatZ: Number
}

export const floorDefaults = extendDefaults<IFloor>(
    [visibleObjectManagerDefaults],
    {
        preset: "industrial0",
        repeatX: 1,
        repeatZ: 1
    }
)
