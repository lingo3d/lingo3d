import ILight, { lightDefaults, lightSchema } from "./ILight"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IDirectionalLight extends ILight {
    shadowArea: number
}

export const directionalLightSchema: Required<ExtractProps<IDirectionalLight>> = {
    ...lightSchema,
    shadowArea: Number
}

export const directionalLightDefaults: Defaults<IDirectionalLight> = {
    ...lightDefaults,
    shadowArea: 1000
}