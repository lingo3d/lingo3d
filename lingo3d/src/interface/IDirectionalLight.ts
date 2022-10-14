import { FAR, SHADOW_DISTANCE } from "../globals"
import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Range from "./utils/Range"

export default interface IDirectionalLight extends ILightBase {
    shadowDistance: number
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    {
        ...lightBaseSchema,
        shadowDistance: Number
    }

export const directionalLightDefaults = extendDefaults<IDirectionalLight>(
    [
        lightBaseDefaults,
        {
            castShadow: true,
            shadowDistance: SHADOW_DISTANCE,
            shadowResolution: 1024
        }
    ],
    {
        shadowDistance: new Range(0, FAR, 100)
    }
)
