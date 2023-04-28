import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISpawnPoint extends IObjectManager {}

export const spawnPointSchema: Required<ExtractProps<ISpawnPoint>> = {
    ...objectManagerSchema
}

export const spawnPointDefaults = extendDefaults<ISpawnPoint>(
    [objectManagerDefaults],
    {}
)
