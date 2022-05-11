import IPrimitive, { primitiveDefaults, primitiveSchema } from "./IPrimitive"
import { ExtractProps } from "./utils/extractProps"

export default interface IReflector extends IPrimitive {
    resolution: number
    blur: number
    contrast: number
    mirror: number
}

export const reflectorSchema: Required<ExtractProps<IReflector>> = {
    ...primitiveSchema,
    resolution: Number,
    blur: Number,
    contrast: Number,
    mirror: Number
}

export const reflectorDefaults: IReflector = {
    ...primitiveDefaults,
    resolution: 512,
    blur: 1024,
    contrast: 1.5,
    mirror: 1
}