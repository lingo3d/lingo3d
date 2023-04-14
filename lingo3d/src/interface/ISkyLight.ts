import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import Range from "./utils/Range"
import { ColorString } from "./ITexturedStandard"

export default interface ISkyLight extends ISimpleObjectManager {
    intensity: number
    color: ColorString
    castShadow: boolean
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...simpleObjectManagerSchema,
    intensity: Number,
    color: String,
    castShadow: Boolean
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [simpleObjectManagerDefaults],
    { intensity: 1, color: "#ffffff", castShadow: true },
    { intensity: new Range(0, 10) },
    { color: true, castShadow: true }
)
