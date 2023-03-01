import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import { nullableDefault } from "./utils/NullableDefault"
import Choices from "./utils/Choices"
import IVisibleObjectManager, {
    visibleObjectManagerDefaults,
    visibleObjectManagerSchema
} from "./IVisibleObjectManager"

export type PhysicsOptions =
    | undefined
    | boolean
    | "map"
    | "character"
    | "convex"
    | "static"

export default interface IPhysicsObjectManager extends IVisibleObjectManager {
    mass: number
    gravity: Nullable<boolean>
    physics: Nullable<PhysicsOptions>
}

export const physicsObjectManagerSchema: Required<
    ExtractProps<IPhysicsObjectManager>
> = {
    ...visibleObjectManagerSchema,
    mass: Number,
    gravity: Boolean,
    physics: [String, Boolean]
}

export const physicsObjectManagerDefaults =
    extendDefaults<IPhysicsObjectManager>(
        [visibleObjectManagerDefaults],
        {
            mass: 1,
            gravity: nullableDefault(true),
            physics: nullableDefault(false)
        },
        {
            physics: new Choices({
                false: false,
                true: true,
                map: "map",
                character: "character",
                convex: "convex",
                static: "static"
            })
        }
    )
