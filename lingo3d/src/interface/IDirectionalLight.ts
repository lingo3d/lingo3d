import ILight, { lightDefaults, lightSchema } from "./ILight"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IDirectionalLight extends ILight {
    shadowDistance: number
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> =
    {
        ...lightSchema,
        shadowDistance: Number
    }

export const directionalLightDefaults: Defaults<IDirectionalLight> = {
    ...lightDefaults,
    shadowDistance: 2000,
    shadowResolution: 1024
}
