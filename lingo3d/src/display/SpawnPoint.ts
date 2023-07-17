import ISpawnPoint, {
    spawnPointDefaults,
    spawnPointSchema
} from "../interface/ISpawnPoint"
import GimbalObjectManager from "./core/GimbalObjectManager"
import HelperCylinder from "./core/helperPrimitives/HelperCylinder"
import { helperSystem } from "../systems/eventSystems/helperSystem"
import { configHelperSystem } from "../systems/configSystems/configHelperSystem"

export default class SpawnPoint
    extends GimbalObjectManager
    implements ISpawnPoint
{
    public static componentName = "spawnPoint"
    public static defaults = spawnPointDefaults
    public static schema = spawnPointSchema

    protected isSpawnPoint = true

    public $createHelper() {
        const helper = new HelperCylinder(this)
        helper.height = 10
        return helper
    }

    public constructor() {
        super()
        helperSystem.add(this)
        configHelperSystem.add(this)
    }
}
