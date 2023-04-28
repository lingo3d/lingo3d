import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"
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

export default interface IEnvironment extends IMeshAppendable {
    texture: Nullable<string | EnvironmentPreset>
}

export const environmentSchema: Required<ExtractProps<IEnvironment>> = {
    ...meshAppendableSchema,
    texture: String
}

export const environmentChoices = new Choices({
    none: undefined,
    studio: "studio",
    day: "day",
    night: "night",
    custom: "custom"
})
export const environmentDefaults = extendDefaults<IEnvironment>(
    [meshAppendableDefaults],
    { texture: "studio" },
    { texture: environmentChoices }
)
