import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { ShadowDistance } from "./ISkyLight"
import Choices from "./utils/Choices"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IDirectionalLight extends ILightBase {
    shadowDistance: ShadowDistance
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    {
        ...lightBaseSchema,
        shadowDistance: String
    }

export const directionalLightDefaults = extendDefaults<IDirectionalLight>(
    [
        lightBaseDefaults,
        {
            shadowDistance: "middle",
            shadowResolution: 1024
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
