import { Point3d } from "@lincode/math"
import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"

export type PhysicsOptions = boolean | "map" | "character" | "convex"

export default interface IPhysicsObjectManager extends ISimpleObjectManager {
    velocity: Point3d
    gravity: Nullable<boolean>
    physics: PhysicsOptions
}

export const physicsObjectManagerSchema: Required<
    ExtractProps<IPhysicsObjectManager>
> = {
    ...simpleObjectManagerSchema,
    velocity: Object,
    gravity: Boolean,
    physics: [String, Boolean]
}
hideSchema(["velocity"])

export const physicsObjectManagerDefaults =
    extendDefaults<IPhysicsObjectManager>([simpleObjectManagerDefaults], {
        velocity: { x: 0, y: 0, z: 0 },
        gravity: new NullableDefault(true),
        physics: false
    })
