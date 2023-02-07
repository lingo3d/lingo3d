import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import IPhysicsObjectManager, {
    physicsObjectManagerDefaults,
    physicsObjectManagerSchema
} from "./IPhysicsObjectManager"

export default interface IReflector extends IPhysicsObjectManager {
    resolution: number
    blur: number
    contrast: number
    mirror: number
}

export const reflectorSchema: Required<ExtractProps<IReflector>> = {
    ...physicsObjectManagerSchema,
    resolution: Number,
    blur: Number,
    contrast: Number,
    mirror: Number
}

export const reflectorDefaults = extendDefaults<IReflector>(
    [physicsObjectManagerDefaults],
    {
        resolution: 256,
        blur: 512,
        contrast: 1.5,
        mirror: 1,
        rotationX: 270,
        scaleZ: 0,
        depth: 0
    },
    {
        resolution: new Range(256, 2048, 256),
        blur: new Range(256, 2048, 128)
    }
)
