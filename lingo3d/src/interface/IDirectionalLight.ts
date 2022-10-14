import { SHADOW_DISTANCE } from "../globals"
import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IDirectionalLight extends ILightBase {
    shadowDistance: number
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    {
        ...lightBaseSchema,
        shadowDistance: Number
    }

export const directionalLightDefaults = extendDefaults<IDirectionalLight>([
    lightBaseDefaults,
    {
        castShadow: true,
        shadowDistance: SHADOW_DISTANCE,
        shadowResolution: 1024
    }
])
