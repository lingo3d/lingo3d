import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface IReflector extends IVisibleObjectManager {
    resolution: number
    blur: number
    contrast: number
    mirror: number
}

export const reflectorSchema: Required<ExtractProps<IReflector>> = {
    ...visibleObjectManagerSchema,
    resolution: Number,
    blur: Number,
    contrast: Number,
    mirror: Number
}

export const reflectorDefaults: Defaults<IReflector> = {
    ...visibleObjectManagerDefaults,
    resolution: 256,
    blur: 512,
    contrast: 1.5,
    mirror: 1,
    rotationX: -90
}
