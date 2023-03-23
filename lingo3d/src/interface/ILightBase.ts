import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface ILightBase extends ISimpleObjectManager {
    color: string
    intensity: number
    castShadow: boolean
    enabled: boolean
    helper: boolean
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...simpleObjectManagerSchema,
    enabled: Boolean,
    helper: Boolean,
    color: String,
    intensity: Number,
    castShadow: Boolean
}

export const lightBaseDefaults = extendDefaults<ILightBase>(
    [simpleObjectManagerDefaults],
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
