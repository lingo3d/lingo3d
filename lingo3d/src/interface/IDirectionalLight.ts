import ILightBase, { lightBaseDefaults, lightBaseSchema } from "./ILightBase"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export default interface IDirectionalLight extends ILightBase {
    shadowDistance: Nullable<number>
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    {
        ...lightBaseSchema,
        shadowDistance: Number
    }

export const directionalLightDefaults: Defaults<IDirectionalLight> = {
    ...lightBaseDefaults,
    castShadow: true,
    shadowDistance: new NullableDefault(3000),
    shadowResolution: new NullableDefault(1024)
}
