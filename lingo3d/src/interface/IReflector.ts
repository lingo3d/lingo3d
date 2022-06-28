import IPlane, { planeDefaults, planeSchema } from "./IPlane"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IReflector extends IPlane {}

export const reflectorSchema: Required<ExtractProps<IReflector>> = {
    ...planeSchema
}

export const reflectorDefaults: Defaults<IReflector> = {
    ...planeDefaults,
    rotationX: -90,
    reflection: true,
    opacity: 0.01
}
