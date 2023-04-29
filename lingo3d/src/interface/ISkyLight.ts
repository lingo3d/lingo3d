import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import { ColorString } from "./ITexturedStandard"
import IMeshAppendable, {
    meshAppendableDefaults,
    meshAppendableSchema
} from "./IMeshAppendable"

export default interface ISkyLight extends IMeshAppendable {
    intensity: number
    color: ColorString
    shadows: boolean
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...meshAppendableSchema,
    intensity: Number,
    color: String,
    shadows: Boolean
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [meshAppendableDefaults],
    { intensity: 1, color: "#ffffff", shadows: true },
    { intensity: new Range(0, 10) },
    { color: true }
)
