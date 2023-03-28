import { Reactive } from "@lincode/reactivity"
import { container } from "../../engine/renderLoop/renderSetup"
import IOrbitCamera, {
    orbitCameraDefaults,
    orbitCameraSchema
} from "../../interface/IOrbitCamera"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { onKeyClear } from "../../events/onKeyClear"
import { getCameraRendered } from "../../states/useCameraRendered"
import { Cancellable } from "@lincode/promiselikes"
import { PerspectiveCamera } from "three"
import { FAR, NEAR } from "../../globals"
import MeshAppendable from "../../api/core/MeshAppendable"
import CameraBase from "../core/CameraBase"
import { getHotKeysEnabled } from "../../states/useHotKeysEnabled"
import {
    addPlaceAtSystem,
    deletePlaceAtSystem
} from "../../systems/placeAtSysytem"
import { addGyrateSystem, deleteGyrateSystem } from "../../systems/gyrateSystem"
import { addFlySystem, deleteFlySystem } from "../../systems/flySystem"

export default class OrbitCamera extends CameraBase implements IOrbitCamera {
    public static componentName = "orbitCamera"
    public static defaults = orbitCameraDefaults
    public static schema = orbitCameraSchema

    public constructor(camera = new PerspectiveCamera(75, 1, NEAR, FAR)) {
        super(camera)

        this.innerZ = 500
        this.orbitMode = true
        this.mouseControl = "drag"

        this.camera.rotation.y = 0

        this.createEffect(() => {
            const found = this.firstChildState.get()
            if (!(found instanceof MeshAppendable)) return

            addPlaceAtSystem(this, { target: found })
            return () => {
                deletePlaceAtSystem(this)
            }
        }, [this.firstChildState.get])

        this.createEffect(() => {
            const autoRotate = this.autoRotateState.get()
            if (getCameraRendered() !== camera || !autoRotate) return

            addGyrateSystem(this, {
                speed: typeof autoRotate === "number" ? autoRotate : 2
            })
            return () => {
                deleteGyrateSystem(this)
            }
        }, [getCameraRendered, this.autoRotateState.get])

        this.createEffect(() => {
            if (
                !getHotKeysEnabled() ||
                getTransformControlsDragging() ||
                getCameraRendered() !== camera ||
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
                const downSet = new Set<string>()
                addFlySystem(this, { downSet })

                const handleKeyDown = (e: KeyboardEvent) => {
                    downSet.add(
                        e.key.length === 1 ? e.key.toLocaleLowerCase() : e.key
                    )
                }
                const handleKeyUp = (e: KeyboardEvent) => {
                    downSet.delete(
                        e.key.length === 1 ? e.key.toLocaleLowerCase() : e.key
                    )
                }
                document.addEventListener("keydown", handleKeyDown)
                document.addEventListener("keyup", handleKeyUp)
                handle.watch(onKeyClear(() => downSet.clear()))

                handle.then(() => {
                    deleteFlySystem(this)
                    document.removeEventListener("keydown", handleKeyDown)
                    document.removeEventListener("keyup", handleKeyUp)
                })
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

    private autoRotateState = new Reactive<boolean | number>(false)
    public get autoRotate() {
        return this.autoRotateState.get()
    }
    public set autoRotate(val) {
        this.autoRotateState.set(val)
    }
}
