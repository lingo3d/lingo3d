import IPositioned, {
    positionedDefaults,
    positionedSchema
} from "./IPositioned"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISpawnPoint extends IPositioned {
    helper: boolean
}

export const spawnPointSchema: Required<ExtractProps<ISpawnPoint>> = {
    ...positionedSchema,
    helper: Boolean
}

export const spawnPointDefaults: Defaults<ISpawnPoint> = {
    ...positionedDefaults,
    helper: true
}
