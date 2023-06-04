import ISpawnPoint, {
    spawnPointDefaults,
    spawnPointSchema
} from "../interface/ISpawnPoint"
import GimbalObjectManager from "./core/GimbalObjectManager"
import SimpleObjectManager from "./core/SimpleObjectManager"
import scene from "../engine/scene"
import HelperCylinder from "./core/utils/HelperCylinder"
import { getWorldPlay } from "../states/useWorldPlay"
import { worldPlayPtr } from "../pointers/worldPlayPtr"

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
            if (worldPlayPtr[0] !== "editor" || this.$disableSceneGraph) return
            const helper = new HelperCylinder(this)
            helper.height = 10
            return () => {
                helper.dispose()
            }
        }, [getWorldPlay])
    }

    public override append(child: SimpleObjectManager) {
        this.$appendNode(child)
        scene.add(child.outerObject3d)
        child.placeAt(this)
    }
}
