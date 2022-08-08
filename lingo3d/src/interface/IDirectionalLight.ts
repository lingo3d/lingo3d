import ILight, { lightDefaults, lightSchema } from "./ILight"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

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
    shadowDistance: [undefined, 2000],
    shadowResolution: [undefined, 1024]
}
