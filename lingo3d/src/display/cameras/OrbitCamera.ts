import { Reactive } from "@lincode/reactivity"
import { camFar, camNear } from "../../engine/constants"
import { container } from "../../engine/renderLoop/renderSetup"
import IOrbitCamera, { orbitCameraDefaults, orbitCameraSchema } from "../../interface/IOrbitCamera"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { onKeyClear } from "../../events/onKeyClear"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"
import { getCameraRendered } from "../../states/useCameraRendered"
import { onBeforeRender } from "../../events/onBeforeRender"
import { Cancellable } from "@lincode/promiselikes"
import { idMap } from "../core/StaticObjectManager"
import { PerspectiveCamera } from "three"
import OrbitCameraBase from "../core/OrbitCameraBase"
import { vector3 } from "../utils/reusables"
import { vec2Point } from "../utils/vec2Point"

export default class OrbitCamera extends OrbitCameraBase implements IOrbitCamera {
    public static componentName = "orbitCamera"
    public static defaults = orbitCameraDefaults
    public static schema = orbitCameraSchema

    public constructor(camera = new PerspectiveCamera(75, 1, camNear, camFar)) {
        super(camera)

        this.innerZ = 500
        this.mouseControlMode = "orbit"
        this.mouseControl = "drag"

        this.camera.rotation.y = 0

        this.createEffect(() => {
            const targetId = this.targetIdState.get()
            if (!targetId) return

            const handle = new Cancellable()
            const timeout = setTimeout(() => {
                const find = () => {
                    const [found] = idMap.get(targetId) ?? [undefined]
                    found && this.targetState.set(found)
                    return found
                }
                if (find()) return

                handle.watch(onSceneGraphChange(() => setTimeout(() => find() && handle.cancel())))
            })
            return () => {
                clearTimeout(timeout)
                handle.cancel()
            }
        }, [this.targetIdState.get])

        this.createEffect(() => {
            if (getTransformControlsDragging() || getCameraRendered() !== camera || !this.mouseControlState.get())
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

                handle.watch(onBeforeRender(() => {
                    if (downSet.has("w"))
                        this.translateZ(downSet.has("Shift") ? -50 : -10)
                    else if (downSet.has("s"))
                        this.translateZ(downSet.has("Shift") ? 50 : 10)

                    if (downSet.has("a"))
                        this.moveRight(-10)
                    else if (downSet.has("d"))
                        this.moveRight(10)

                    if (downSet.has("w") || downSet.has("s") || downSet.has("a") || downSet.has("d")) {
                        const worldPos = this.object3d.getWorldPosition(vector3)
                        this.innerZ = 0
                        this.placeAt(vec2Point(worldPos))
                    }

                    if (downSet.has("ArrowDown"))
                        this.y -= 10
                    else if (downSet.has("ArrowUp"))
                        this.y += 10
                }))

                const handleKeyDown = (e: KeyboardEvent) => {
                    downSet.add(e.key.length === 1 ? e.key.toLowerCase() : e.key)
                }
                const handleKeyUp = (e: KeyboardEvent) => {
                    downSet.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key)
                }
                document.addEventListener("keydown", handleKeyDown)
                document.addEventListener("keyup", handleKeyUp)
                handle.watch(onKeyClear(() => downSet.clear()))

                handle.then(() => {
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

    private targetIdState = new Reactive<string | undefined>(undefined)
    public get targetId() {
        return this.targetIdState.get()
    }
    public set targetId(val: string | undefined) {
        this.targetIdState.set(val)
    }

    private enableDampingState = new Reactive(false)
    public get enableDamping() {
        return this.enableDampingState.get()
    }
    public set enableDamping(val: boolean) {
        this.enableDampingState.set(val)
    }

    private enableZoomState = new Reactive(false)
    public get enableZoom() {
        return this.enableZoomState.get()
    }
    public set enableZoom(val: boolean) {
        this.enableZoomState.set(val)
    }

    private enableFlyState = new Reactive(false)
    public get enableFly() {
        return this.enableFlyState.get()
    }
    public set enableFly(val: boolean) {
        this.enableFlyState.set(val)
    }

    private autoRotateState = new Reactive(false)
    public get autoRotate() {
        return this.autoRotateState.get()
    }
    public set autoRotate(val: boolean) {
        this.autoRotateState.set(val)
    }

    private _autoRotateSpeed = 1
    public get autoRotateSpeed() {
        return this._autoRotateSpeed
    }
    public set autoRotateSpeed(val) {
        this._autoRotateSpeed = val
    }
}