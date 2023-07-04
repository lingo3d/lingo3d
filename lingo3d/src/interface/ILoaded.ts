import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"
import { extendDefaults } from "./utils/Defaults"
import IPhysicsObjectManager, {
    physicsObjectManagerDefaults,
    physicsObjectManagerSchema
} from "./IPhysicsObjectManager"

export default interface ILoaded extends IPhysicsObjectManager {
    src: Nullable<string>
    onLoad: Nullable<() => void>
}

export const loadedSchema: Required<ExtractProps<ILoaded>> = {
    ...physicsObjectManagerSchema,
    src: String,
    onLoad: Function
}

export const loadedDefaults = extendDefaults<ILoaded>(
    [physicsObjectManagerDefaults],
    {
        src: undefined,
        onLoad: undefined
    }
)
