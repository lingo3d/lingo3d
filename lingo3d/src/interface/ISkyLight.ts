import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface ISkyLight extends ILightBase {
    groundColor: string
    ambientIntensity: number
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    groundColor: String,
    ambientIntensity: Number
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [lightBaseDefaults],
    {
        groundColor: "#ffffff",
        intensity: 0.5,
        ambientIntensity: 0.5
    },
    { ambientIntensity: new Range(0, 2) }
)
