import { Reactive } from "@lincode/reactivity"
import ISpawnPoint, {
    spawnPointDefaults,
    spawnPointSchema
} from "../interface/ISpawnPoint"
import ObjectManager from "./core/ObjectManager"
import SimpleObjectManager from "./core/SimpleObjectManager"
import scene from "../engine/scene"
import { addSelectionHelper } from "./core/utils/raycast/selectionCandidates"
import HelperCylinder from "./core/utils/HelperCylinder"
import { getEditorHelper } from "../states/useEditorHelper"

export default class SpawnPoint extends ObjectManager implements ISpawnPoint {
    public static componentName = "spawnPoint"
    public static defaults = spawnPointDefaults
    public static schema = spawnPointSchema

    private helperState = new Reactive(true)
    public get helper() {
        return this.helperState.get()
    }
    public set helper(val) {
        this.helperState.set(val)
    }

    protected isSpawnPoint = true

    public constructor() {
        super()

        this.createEffect(() => {
            if (!this.helperState.get() || !getEditorHelper()) return

            const helper = new HelperCylinder()
            const handle = addSelectionHelper(helper, this)
            helper.height = 10

            return () => {
                handle.cancel()
            }
        }, [this.helperState.get, getEditorHelper])
    }

    public override append(child: SimpleObjectManager) {
        this.appendNode(child)
        scene.add(child.outerObject3d)
        child.placeAt(this)
    }
}
