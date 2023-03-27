import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import Range from "./utils/Range"

export default interface ISkyLight extends ISimpleObjectManager {
    intensity: number
    castShadow: boolean
    cascadeShadow: boolean
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...simpleObjectManagerSchema,
    intensity: Number,
    castShadow: Boolean,
    cascadeShadow: Boolean
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [simpleObjectManagerDefaults],
    { intensity: 1, castShadow: true, cascadeShadow: false },
    { intensity: new Range(0, 10) },
    { castShadow: true }
)
