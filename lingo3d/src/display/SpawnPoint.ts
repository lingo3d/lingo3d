import { Reactive } from "@lincode/reactivity"
import Cylinder from "./primitives/Cylinder"
import mainCamera from "../engine/mainCamera"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../events/onSelectionTarget"
import { appendableRoot } from "../api/core/Appendable"
import { getCameraRendered } from "../states/useCameraRendered"
import ISpawnPoint, {
    spawnPointDefaults,
    spawnPointSchema
} from "../interface/ISpawnPoint"
import { getCentripetal } from "../states/useCentripetal"
import { onTransformControls } from "../events/onTransformControls"
import ObjectManager from "./core/ObjectManager"
import SimpleObjectManager from "./core/SimpleObjectManager"
import applyCentripetalQuaternion from "./utils/applyCentripetalQuaternion"

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

    public constructor() {
        super()

        this.createEffect(() => {
            if (!this.helperState.get() || getCameraRendered() !== mainCamera)
                return

            const h = new Cylinder()
            appendableRoot.delete(h)
            this.outerObject3d.add(h.outerObject3d)
            h.opacity = 0.5
            h.height = 10

            const handle = onSelectionTarget(
                ({ target }) => target === h && emitSelectionTarget(this)
            )
            return () => {
                h.dispose()
                handle.cancel()
            }
        }, [this.helperState.get, getCameraRendered])

        this.createEffect(() => {
            if (!getCentripetal()) return

            applyCentripetalQuaternion(this)

            const handle = onTransformControls(() =>
                applyCentripetalQuaternion(this)
            )
            return () => {
                handle.cancel()
            }
        }, [getCentripetal])
    }

    public override append(child: SimpleObjectManager) {
        this._append(child)
        //todo: scene.add(child)
        child.placeAt(this)
    }
}
