import IPlane, { planeDefaults, planeSchema } from "./IPlane"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IReflector extends IPlane {
    reflectivity: number
}

export const reflectorSchema: Required<ExtractProps<IReflector>> = {
    ...planeSchema,
    reflectivity: Number
}

export const reflectorDefaults: Defaults<IReflector> = {
    ...planeDefaults,

    reflectivity: 1,

    rotationX: -90,
    opacity: 0.01,
    color: "#777777"
}
