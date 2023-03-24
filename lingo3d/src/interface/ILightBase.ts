import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    castShadow: boolean
    enabled: boolean
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    enabled: Boolean,
    helper: Boolean,
    color: String,
    intensity: Number,
    castShadow: Boolean
}

export const lightBaseDefaults = extendDefaults<ILightBase>(
    [objectManagerDefaults],
    {
        color: "#ffffff",
        intensity: 1,
        castShadow: false,
        enabled: true,
        helper: true
    },
    {
        intensity: new Range(0, 10)
    },
    { color: true, castShadow: true }
)
