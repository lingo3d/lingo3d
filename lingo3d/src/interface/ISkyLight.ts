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
    castShadow: boolean
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...meshAppendableSchema,
    intensity: Number,
    color: String,
    castShadow: Boolean
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [meshAppendableDefaults],
    { intensity: 1, color: "#ffffff", castShadow: true },
    { intensity: new Range(0, 10) },
    { color: true, castShadow: true }
)
