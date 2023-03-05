import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import IPhysicsObjectManager, {
    physicsObjectManagerDefaults,
    physicsObjectManagerSchema
} from "./IPhysicsObjectManager"
import { nullableCallback } from "./utils/NullableCallback"

export default interface ILoaded extends IPhysicsObjectManager {
    src: Nullable<string>
    onLoad: Nullable<() => void>
    boxVisible: boolean
}

export const loadedSchema: Required<ExtractProps<ILoaded>> = {
    ...physicsObjectManagerSchema,
    src: String,
    onLoad: Function,
    boxVisible: Boolean
}

export const loadedDefaults = extendDefaults<ILoaded>(
    [physicsObjectManagerDefaults],
    {
        src: undefined,
        onLoad: nullableCallback(),
        boxVisible: false
    }
)
