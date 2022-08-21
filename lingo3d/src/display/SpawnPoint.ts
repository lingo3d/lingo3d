import { Reactive } from "@lincode/reactivity"
import { Object3D } from "three"
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
import { halfPi } from "./utils/reusables"
import { getCentripetal } from "../states/useCentripetal"
import getWorldPosition from "./utils/getWorldPosition"
import { onTransformControls } from "../events/onTransformControls"
import ObjectManager from "./core/ObjectManager"
import SimpleObjectManager from "./core/SimpleObjectManager"
import MeshItem from "./core/MeshItem"

const dirObj = new Object3D()

const setCentripetalQuaternion = (target: MeshItem) => {
    const dir = getWorldPosition(target.outerObject3d).normalize()
    dirObj.lookAt(dir)
    dirObj.rotateX(halfPi)
    target.outerObject3d.quaternion.copy(dirObj.quaternion)
}

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

            setCentripetalQuaternion(this)

            const handle = onTransformControls(() =>
                setCentripetalQuaternion(this)
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
