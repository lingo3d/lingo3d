import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISpawnPoint extends IObjectManager {
    helper: boolean
}

export const spawnPointSchema: Required<ExtractProps<ISpawnPoint>> = {
    ...objectManagerSchema,
    helper: Boolean
}

export const spawnPointDefaults = extendDefaults<ISpawnPoint>(
    [objectManagerDefaults],
    { helper: true }
)
