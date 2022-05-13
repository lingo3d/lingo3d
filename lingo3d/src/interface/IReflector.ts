import IPlane, { planeDefaults, planeSchema } from "./IPlane"
import { ExtractProps } from "./utils/extractProps"

export default interface IReflector extends IPlane {
    resolution: number
    blur: number
    contrast: number
    mirror: number
}

export const reflectorSchema: Required<ExtractProps<IReflector>> = {
    ...planeSchema,
    resolution: Number,
    blur: Number,
    contrast: Number,
    mirror: Number
}

export const reflectorDefaults: IReflector = {
    ...planeDefaults,
    resolution: 512,
    blur: 1024,
    contrast: 1.5,
    mirror: 1
}