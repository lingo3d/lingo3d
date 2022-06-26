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
import { vec2Point } from "../utils/vec2Point"
import { getObject3d } from "../core/MeshItem"
import getWorldPosition from "../utils/getWorldPosition"
import getCenter from "../utils/getCenter"

export default class OrbitCamera extends OrbitCameraBase implements IOrbitCamera {
    public static componentName = "orbitCamera"
    public static defaults = orbitCameraDefaults
    public static schema = orbitCameraSchema

    public constructor(camera = new PerspectiveCamera(75, 1, camNear, camFar)) {
        super(camera)

        this.innerZ = 500
        this.orbitMode = true
        this.mouseControl = "drag"

        this.camera.rotation.y = 0

        this.createEffect(() => {
            const targetId = this.targetIdState.get()
            if (!targetId) return

            const handle = new Cancellable()
            const timeout = setTimeout(() => {
                const find = () => {
                    const [found] = idMap.get(targetId) ?? [undefined]
                    if (found) {
                        this.manualTarget = found
                        this.targetState.set(found)
                    }
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
            const target = this.targetState.get()
            if (!target) return

            const handle = onBeforeRender(() => {
                this.placeAt(vec2Point(getCenter(getObject3d(target))))
            })
            return () => {
                handle.cancel()
            }
        }, [this.targetState.get])

        this.createEffect(() => {
            const autoRotate = this.autoRotateState.get()
            if (getCameraRendered() !== camera || !autoRotate) return

            const speed = typeof autoRotate === "number" ? autoRotate : 2
            const handle = onBeforeRender(() => {
                this.gyrate(speed, 0, true)
            })
            return () => {
                handle.cancel()
            }
        }, [getCameraRendered, this.autoRotateState.get])

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
                        const worldPos = vec2Point(getWorldPosition(this.object3d))
                        this.innerZ = 0
                        this.placeAt(worldPos)
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
    public set targetId(val) {
        this.targetIdState.set(val)
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