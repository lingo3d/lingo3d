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
    gravity: Nullable<boolean>
    physics: Nullable<PhysicsOptions>
}

export const physicsObjectManagerSchema: Required<
    ExtractProps<IPhysicsObjectManager>
> = {
    ...simpleObjectManagerSchema,
    gravity: Boolean,
    physics: [String, Boolean]
}
hideSchema(["velocity"])

export const physicsObjectManagerDefaults =
    extendDefaults<IPhysicsObjectManager>([simpleObjectManagerDefaults], {
        gravity: new NullableDefault(true),
        physics: new NullableDefault(false)
    })
