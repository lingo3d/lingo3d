import ISimpleObjectManager, {
    simpleObjectManagerDefaults,
    simpleObjectManagerSchema
} from "./ISimpleObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { hideSchema } from "./utils/nonEditorSchemaSet"
import { extendDefaults } from "./utils/Defaults"
import Nullable from "./utils/Nullable"
import NullableDefault from "./utils/NullableDefault"
import Choices from "./utils/Choices"

export type PhysicsOptions =
    | undefined
    | boolean
    | "map"
    | "character"
    | "convex"
    | "static"

export default interface IPhysicsObjectManager extends ISimpleObjectManager {
    mass: number
    gravity: Nullable<boolean>
    physics: Nullable<PhysicsOptions>
}

export const physicsObjectManagerSchema: Required<
    ExtractProps<IPhysicsObjectManager>
> = {
    ...simpleObjectManagerSchema,
    mass: Number,
    gravity: Boolean,
    physics: [String, Boolean]
}
hideSchema(["velocity"])

export const physicsObjectManagerDefaults =
    extendDefaults<IPhysicsObjectManager>(
        [simpleObjectManagerDefaults],
        {
            mass: 1,
            gravity: new NullableDefault(true),
            physics: new NullableDefault(false)
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
