import ISpawnPoint, {
    spawnPointDefaults,
    spawnPointSchema
} from "../interface/ISpawnPoint"
import GimbalObjectManager from "./core/GimbalObjectManager"
import SimpleObjectManager from "./core/SimpleObjectManager"
import scene from "../engine/scene"
import HelperCylinder from "./core/helperPrimitives/HelperCylinder"
import { getWorldMode } from "../states/useWorldMode"
import { worldModePtr } from "../pointers/worldModePtr"

export default class SpawnPoint
    extends GimbalObjectManager
    implements ISpawnPoint
{
    public static componentName = "spawnPoint"
    public static defaults = spawnPointDefaults
    public static schema = spawnPointSchema

    protected isSpawnPoint = true

    public constructor() {
        super()

        this.createEffect(() => {
            if (worldModePtr[0] !== "editor" || this.$disableSceneGraph) return
            const helper = new HelperCylinder(this)
            helper.height = 10
            return () => {
                helper.dispose()
            }
        }, [getWorldMode])
    }

    public override append(child: SimpleObjectManager) {
        this.$appendNode(child)
        scene.add(child.$object)
        child.placeAt(this)
    }
}
