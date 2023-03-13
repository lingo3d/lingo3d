import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import Choices from "./utils/Choices"
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
    texture: Nullable<string | EnvironmentPreset>
    helper: boolean
}

export const environmentSchema: Required<ExtractProps<IEnvironment>> = {
    ...positionedSchema,
    texture: String,
    helper: Boolean
}

export const environmentChoices = new Choices({
    none: undefined,
    studio: "studio",
    day: "day",
    night: "night",
    custom: "custom"
})
export const environmentDefaults = extendDefaults<IEnvironment>(
    [positionedDefaults],
    { texture: "studio", helper: true },
    { texture: environmentChoices }
)
