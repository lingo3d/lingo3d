import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Range from "./utils/Range"
import Nullable from "./utils/Nullable"
import IPhysicsObjectManager, {
    physicsObjectManagerDefaults,
    physicsObjectManagerSchema
} from "./IPhysicsObjectManager"

export default interface IWater extends IPhysicsObjectManager {
    shape: "plane" | "sphere"
    normalMap: Nullable<string>
    resolution: number
    speed: number
}

export const waterSchema: Required<ExtractProps<IWater>> = {
    ...physicsObjectManagerSchema,
    shape: String,
    normalMap: String,
    resolution: Number,
    speed: Number
}

export const waterDefaults = extendDefaults<IWater>(
    [physicsObjectManagerDefaults],
    {
        shape: "plane",
        normalMap: undefined,
        resolution: 512,
        speed: 1,
        rotationX: 270,
        scaleZ: 0,
        depth: 0
    },
    {
        resolution: new Range(256, 2048, 256),
        speed: new Range(0.1, 10)
    },
    { normalMap: true }
)
