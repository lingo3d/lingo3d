import ILight, { lightDefaults, lightSchema } from "./ILight"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export default interface IDirectionalLight extends ILight {
    shadowDistance: Nullable<number>
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    {
        ...lightSchema,
        shadowDistance: Number
    }

export const directionalLightDefaults: Defaults<IDirectionalLight> = {
    ...lightDefaults,
    shadowDistance: new NullableDefault(3000),
    shadowResolution: new NullableDefault(1024)
}
