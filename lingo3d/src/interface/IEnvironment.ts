import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export const environmentPreset = {
    studio: "studio.jpg",
    day: "day.hdr",
    night: "night.hdr"
}

export type EnvironmentPreset = keyof typeof environmentPreset

export default interface IEnvironment extends IPositioned {
    texture: Nullable<string | EnvironmentPreset | "dynamic">
    helper: boolean
}

export const environmentSchema: Required<ExtractProps<IEnvironment>> = {
    ...positionedSchema,
    texture: String,
    helper: Boolean
}

export const environmentDefaults = extendDefaults<IEnvironment>(
    [positionedDefaults],
    { texture: "studio", helper: true }
)
