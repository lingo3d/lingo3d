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

const dirObj = new Object3D()

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

        this.queueMicrotask(() => this.updateCentripetal())

        this.createEffect(() => {
            if (!getCentripetal()) return

            const handle = onTransformControls(() => this.updateCentripetal())
            return () => {
                handle.cancel()
            }
        }, [getCentripetal])
    }

    private updateCentripetal() {
        const dir = getWorldPosition(this.outerObject3d).normalize()
        dirObj.lookAt(dir)
        dirObj.rotateX(halfPi)
        const quat = dirObj.quaternion
        this.outerObject3d.quaternion.copy(quat)
    }
}
