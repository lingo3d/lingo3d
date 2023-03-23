import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"

export default interface ISkyLight extends IObjectManager {
    intensity: number
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...objectManagerSchema,
    intensity: Number
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [objectManagerDefaults],
    { intensity: 1 }
)
