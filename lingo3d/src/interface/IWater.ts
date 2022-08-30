import IObjectManager, {
    objectManagerDefaults,
    objectManagerSchema
} from "./IObjectManager"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISpawnPoint extends IObjectManager {
    helper: boolean
}

export const spawnPointSchema: Required<ExtractProps<ISpawnPoint>> = {
    ...objectManagerSchema,
    helper: Boolean
}

export const spawnPointDefaults: Defaults<ISpawnPoint> = {
    ...objectManagerDefaults,
    helper: true
}
