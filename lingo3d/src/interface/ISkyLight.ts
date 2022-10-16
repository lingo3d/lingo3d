import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Choices from "./utils/Choices"

export type ShadowDistance = "near" | "middle" | "far"

export default interface ISkyLight extends ILightBase {
    groundColor: string
    shadowDistance: ShadowDistance
}

export const skyLightSchema: Required<ExtractProps<ISkyLight>> = {
    ...lightBaseSchema,
    shadowDistance: String,
    groundColor: String
}

export const skyLightDefaults = extendDefaults<ISkyLight>(
    [
        lightBaseDefaults,
        {
            groundColor: "#ffffff",
            shadowDistance: "middle",
            intensity: 0.5
        }
    ],
    {
        shadowDistance: new Choices({
            near: "near",
            middle: "middle",
            far: "far"
        })
    }
)
