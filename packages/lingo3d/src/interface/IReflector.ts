import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"

export type ReflectorShape = "plane" | "circle"

export default interface IReflector extends IObjectManager {
    shape?: ReflectorShape
    contrast: number
    blur: number
}

export const reflectorSchema: Required<ExtractProps<IReflector>> = {
    ...objectManagerSchema,
    shape: String,
    contrast: Number,
    blur: Number
}

export const reflectorDefaults: IReflector = {
    ...objectManagerDefaults,
    contrast: 0.5,
    blur: 2
}