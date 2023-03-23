import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"

export default interface ISkyLight extends ISimpleObjectManager {
    intensity: number
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...simpleObjectManagerSchema,
    intensity: Number
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [simpleObjectManagerDefaults],
    { intensity: 1 }
)
