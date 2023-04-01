import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Choices from "./utils/Choices"

export default interface ILightBase extends IObjectManager {
    color: string
    intensity: number
    castShadow: boolean | "static"
    enabled: boolean
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...objectManagerSchema,
    enabled: Boolean,
    helper: Boolean,
    color: String,
    intensity: Number,
    castShadow: [Boolean, String]
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
        intensity: new Range(0, 10),
        castShadow: new Choices({ true: true, false: false, static: "static" })
    },
    { color: true, castShadow: true }
)
