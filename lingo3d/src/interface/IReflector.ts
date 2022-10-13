import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

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

export const reflectorDefaults = extendDefaults<IReflector>([
    visibleObjectManagerDefaults,
    {
        resolution: 256,
        blur: 512,
        contrast: 1.5,
        mirror: 1,
        rotationX: -90
    }
])
