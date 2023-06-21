import { Reactive } from "@lincode/reactivity"
import IOrbitCamera, {
    orbitCameraDefaults,
    orbitCameraSchema
} from "../../interface/IOrbitCamera"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getCameraRendered } from "../../states/useCameraRendered"
import { Cancellable } from "@lincode/promiselikes"
import { PerspectiveCamera } from "three"
import { FAR, NEAR } from "../../globals"
import MeshAppendable from "../core/MeshAppendable"
import CameraBase from "../core/CameraBase"
import { getHotKeysEnabled } from "../../states/useHotKeysEnabled"
import { container } from "../../engine/renderLoop/containers"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { gyrateSystem } from "../../systems/gyrateSystem"
import { flySystem } from "../../systems/flySystem"
import { orbitCameraPlaceAtSystem } from "../../systems/orbitCameraPlaceAtSystem"

export default class OrbitCamera extends CameraBase implements IOrbitCamera {
    public static componentName = "orbitCamera"
    public static defaults = orbitCameraDefaults
    public static schema = orbitCameraSchema

    public constructor(camera = new PerspectiveCamera(75, 1, NEAR, FAR)) {
        super(camera)

        this.innerZ = 500
        this.orbitMode = true
        this.mouseControl = "drag"

        this.$camera.rotation.y = 0

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) return

            orbitCameraPlaceAtSystem.add(this, { target: found })
            return () => {
                orbitCameraPlaceAtSystem.delete(this)
            }
        }, [this.firstChildState.get])

        this.createEffect(() => {
            if (
                !getHotKeysEnabled() ||
                getTransformControlsDragging() ||
                cameraRenderedPtr[0] !== camera ||
                !this.mouseControlState.get()
            )
                return

            const handle = new Cancellable()

            if (this.enableZoomState.get()) {
                const cb = (e: WheelEvent) => {
                    e.preventDefault()
                    this.innerZ += e.deltaY
                    if (this.innerZ < 0) this.innerZ = 0
                }
                container.addEventListener("wheel", cb)
                handle.then(() => container.removeEventListener("wheel", cb))
            }

            if (this.enableFlyState.get()) {
                flySystem.add(this)
                handle.then(() => flySystem.delete(this))
            }
            return () => {
                handle.cancel()
            }
        }, [
            getHotKeysEnabled,
            getCameraRendered,
            getTransformControlsDragging,
            this.enableZoomState.get,
            this.enableFlyState.get,
            this.mouseControlState.get
        ])
    }

    private enableZoomState = new Reactive(false)
    public get enableZoom() {
        return this.enableZoomState.get()
    }
    public set enableZoom(val) {
        this.enableZoomState.set(val)
    }

    private enableFlyState = new Reactive(false)
    public get enableFly() {
        return this.enableFlyState.get()
    }
    public set enableFly(val) {
        this.enableFlyState.set(val)
    }

    private _autoRotate = false
    public get autoRotate() {
        return this._autoRotate
    }
    public set autoRotate(val) {
        this._autoRotate = val
        val ? gyrateSystem.add(this) : gyrateSystem.delete(this)
    }

    public autoRotateSpeed = 2
}
