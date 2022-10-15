import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"

export default interface ISkyLight extends ILightBase {
    groundColor: string
    sun: boolean
    sunIntensity: number
    sunColor: string
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    groundColor: String,
    sun: Boolean,
    sunIntensity: Number,
    sunColor: String
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [
        lightBaseDefaults,
        {
            groundColor: "#ffffff",
            sun: true,
            sunIntensity: 0.5,
            sunColor: "#ffffff"
        }
    ],
    {
        sunIntensity: new Range(0, 10)
    }
)
