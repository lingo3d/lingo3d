import IGimbalObjectManager, {
    gimbalObjectManagerDefaults,
    gimbalObjectManagerSchema
} from "./IGimbalObjectManager"
import { ExtractProps } from "./utils/extractProps"
import { extendDefaults } from "./utils/Defaults"

export default interface ISpawnPoint extends IGimbalObjectManager {}

export const spawnPointSchema: Required<ExtractProps<ISpawnPoint>> = {
    ...gimbalObjectManagerSchema
}

export const spawnPointDefaults = extendDefaults<ISpawnPoint>(
    [gimbalObjectManagerDefaults],
    {}
)
