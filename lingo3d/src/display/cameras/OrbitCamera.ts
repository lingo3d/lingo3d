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
import { vec2Point } from "../utils/vec2Point"
import getWorldPosition from "../utils/getWorldPosition"
import getCenter from "../utils/getCenter"
import { FAR, NEAR } from "../../globals"
import MeshAppendable from "../../api/core/MeshAppendable"
import CameraBase from "../core/CameraBase"
import renderSystemWithData from "../../utils/renderSystemWithData"

const [addPlaceAtSystem, deletePlaceAtSystem] = renderSystemWithData(
    (cam: OrbitCamera, data: { found: MeshAppendable }) => {
        cam.placeAt(vec2Point(getCenter(data.found.object3d)))
    }
)

const [addGyrateSystem, deleteGyrateSystem] = renderSystemWithData(
    (cam: OrbitCamera, data: { speed: number }) => {
        cam.gyrate(data.speed, 0, true)
    }
)

const [addFlySystem, deleteFlySystem] = renderSystemWithData(
    (cam: OrbitCamera, { downSet }: { downSet: Set<string> }) => {
        if (downSet.has("Meta") || downSet.has("Control")) return

        const speed = downSet.has("Shift") ? 50 : 10

        if (downSet.has("w")) cam.translateZ(-speed)
        else if (downSet.has("s")) cam.translateZ(speed)

        if (downSet.has("a") || downSet.has("ArrowLeft")) cam.moveRight(-speed)
        else if (downSet.has("d") || downSet.has("ArrowRight"))
            cam.moveRight(speed)

        if (
            downSet.has("w") ||
            downSet.has("s") ||
            downSet.has("a") ||
            downSet.has("d")
        ) {
            const worldPos = vec2Point(getWorldPosition(cam.object3d))
            cam.innerZ = 0
            cam.placeAt(worldPos)
        }
        if (downSet.has("Meta") || downSet.has("Control")) return

        if (downSet.has("ArrowDown")) cam.y -= speed
        else if (downSet.has("ArrowUp")) cam.y += speed
    }
)

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

            addPlaceAtSystem(this, { found })
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
