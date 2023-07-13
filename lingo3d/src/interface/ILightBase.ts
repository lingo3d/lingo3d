import IGimbalObjectManager, {
    gimbalObjectManagerDefaults,
    gimbalObjectManagerSchema
} from "./IGimbalObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import { ColorString } from "./ITexturedStandard"

export default interface ILightBase extends IGimbalObjectManager {
    color: ColorString
    intensity: number
}

export const lightBaseSchema: Required<ExtractProps<ILightBase>> = {
    ...gimbalObjectManagerSchema,
    color: String,
    intensity: Number
}

export const lightBaseDefaults = extendDefaults<ILightBase>(
    [gimbalObjectManagerDefaults],
    {
        color: "#ffffff",
        intensity: 1
    },
    { intensity: new Range(0, 20) },
    { color: true }
)
