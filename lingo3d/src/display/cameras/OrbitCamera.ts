import { deg2Rad, rad2Deg } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { applyMixins } from "@lincode/utils"
import { PerspectiveCamera } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { camFar, camNear, scaleDown, scaleUp } from "../../engine/constants"
import { container } from "../../engine/renderLoop/renderSetup"
import EventLoopItem from "../../api/core/EventLoopItem"
import CameraMixin from "../core/mixins/CameraMixin"
import IOrbitCamera, { orbitCameraDefaults, orbitCameraSchema } from "../../interface/IOrbitCamera"
import { vector3 } from "../utils/reusables"
import { MIN_POLAR_ANGLE, MAX_POLAR_ANGLE } from "../../globals"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { onKeyClear } from "../../events/onKeyClear"
import { onSceneGraphChange } from "../../events/onSceneGraphChange"
import PositionedItem from "../../api/core/PositionedItem"
import { getCameraRendered } from "../../states/useCameraRendered"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import { Cancellable } from "@lincode/promiselikes"
import { staticIdMap } from "../core/StaticObjectManager"
import MeshItem from "../core/MeshItem"

class OrbitCamera extends PositionedItem implements IOrbitCamera {
    public static componentName = "orbitCamera"
    public static defaults = orbitCameraDefaults
    public static schema = orbitCameraSchema

    private controls: OrbitControls

    public constructor(
        protected camera = new PerspectiveCamera(75, 1, camNear, camFar)
    ) {
        super(camera)

        this.initCamera()

        this.createEffect(() => {
            const target = this.targetState.get()
            if (!target) {
                const handle = onBeforeRender(() => this.controls.update())
                return () => {
                    handle.cancel()
                }
            }
            const handle0 = onBeforeRender(() => {
                this.controls.target.copy(target.outerObject3d.getWorldPosition(vector3))
                this.controls.update()
            })
            const handle1 = onSceneGraphChange(() => target.parent !== this && this.targetState.set(undefined))
            
            return () => {
                handle0.cancel
                handle1.cancel()
            }
        }, [this.targetState.get])

        this.createEffect(() => {
            const targetId = this.targetIdState.get()
            if (!targetId) return

            const handle = new Cancellable()
            setTimeout(() => {
                if (handle.done) return

                const find = () => {
                    const found = [...staticIdMap.get(targetId) ?? [undefined]][0]
                    found && this.targetState.set(found)
                    return found
                }
                if (find()) return

                handle.watch(onSceneGraphChange(() => setTimeout(() => find() && handle.cancel())))
            })
            return () => {
                handle.cancel()
            }
        }, [this.targetIdState.get])

        const controls = this.controls = new OrbitControls(camera, container)
        controls.enabled = false
        controls.enablePan = false
        controls.enableZoom = false
        controls.minPolarAngle = this._minPolarAngle
        controls.maxPolarAngle = this._maxPolarAngle
        controls.minAzimuthAngle = this._minAzimuthAngle
        controls.maxAzimuthAngle = this._maxAzimuthAngle

        camera.position.z = 5
        controls.update()

        this.createEffect(() => {
            if (getTransformControlsDragging() || getCameraRendered() !== camera || !this.enabledState.get()) return

            const handle = new Cancellable()
            controls.enabled = true

            if (this.enableZoomState.get()) {
                const cb = (e: WheelEvent) => {
                    e.preventDefault()

                    const direction = camera.getWorldDirection(vector3)
                    let pt = camera.position.clone().add(direction.clone().multiplyScalar(-e.deltaY * scaleDown))

                    const localPt = camera.worldToLocal(pt.clone())
                    const localTarget = camera.worldToLocal(controls.target.clone())
                    
                    if (localPt.z - localTarget.z <= 1)
                        pt = controls.target.clone().add(direction.multiplyScalar(-1))

                    camera.position.copy(pt)
                }
                container.addEventListener("wheel", cb)
                handle.then(() => container.removeEventListener("wheel", cb))
            }

            if (this.enableFlyState.get()) {
                const downSet = new Set<string>()

                const moveForward = (distance: number) => {
                    const direction = camera.getWorldDirection(vector3)
                    camera.position.add(direction.clone().multiplyScalar(distance * scaleDown))
                    controls.target.copy(camera.position).add(direction)
                }
                const moveRight = (distance: number) => {
                    vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
                    camera.position.addScaledVector(vector3, distance * scaleDown)
                    controls.target.addScaledVector(vector3, distance * scaleDown)
                }
                const moveUp = (distance: number) => {
                    const dist = distance * scaleDown
                    camera.position.y += dist
                    controls.target.y += dist
                }
                handle.watch(onBeforeRender(() => {
                    if (downSet.has("w"))
                        moveForward(downSet.has("Shift") ? 50 : 10)
                    else if (downSet.has("s"))
                        moveForward(downSet.has("Shift") ? -50 : -10)

                    if (downSet.has("a"))
                        moveRight(-10)
                    else if (downSet.has("d"))
                        moveRight(10)

                    if (downSet.has("ArrowDown"))
                        moveUp(-10)
                    else if (downSet.has("ArrowUp"))
                        moveUp(10)
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
                controls.enabled = false
            }
        }, [
            getCameraRendered,
            getTransformControlsDragging,
            this.enableZoomState.get,
            this.enableFlyState.get,
            this.enabledState.get
        ])

        scene.add(camera)
        this.then(() => {
            controls.dispose()
            scene.remove(camera)
        })
    }

    private _targetX?: number
    public get targetX() {
        return this._targetX ??= 0
    }
    public set targetX(val: number) {
        this._targetX = val
        this.controls.target.x = val * scaleDown
        this.controls.update()
    }

    private _targetY?: number
    public get targetY() {
        return this._targetY ??= 0
    }
    public set targetY(val: number) {
        this._targetY = val
        this.controls.target.y = val * scaleDown
        this.controls.update()
    }
    
    private _targetZ?: number
    public get targetZ() {
        return this._targetZ ??= 0
    }
    public set targetZ(val: number) {
        this._targetZ = val
        this.controls.target.z = val * scaleDown
        this.controls.update()
    }

    private targetState = new Reactive<MeshItem | undefined>(undefined)
    public override append(object: MeshItem) {
        if (this.targetState.get()) {
            super.append(object)
            return
        }
        this._append(object)
        this.outerObject3d.parent?.add(object.outerObject3d)
        this.targetState.set(object)
    }

    public override attach(object: MeshItem) {
        if (this.targetState.get()) {
            super.attach(object)
            return
        }
        this._append(object)
        this.outerObject3d.parent?.attach(object.outerObject3d)
        this.targetState.set(object)
    }

    private targetIdState = new Reactive<string | undefined>(undefined)
    public get targetId() {
        return this.targetIdState.get()
    }
    public set targetId(val: string | undefined) {
        this.targetIdState.set(val)
    }

    public override get x() {
        return this.camera.position.x * scaleUp
    }
    public override set x(val: number) {
        this.camera.position.x = val * scaleDown
    }

    public override get y() {
        return this.camera.position.y * scaleUp
    }
    public override set y(val: number) {
        this.camera.position.y = val * scaleDown
    }

    public override get z() {
        return this.camera.position.z * scaleUp
    }
    public override set z(val: number) {
        this.camera.position.z = val * scaleDown
    }

    public get rotationX() {
        return this.camera.rotation.x * rad2Deg
    }

    public get rotationY() {
        return this.camera.rotation.y * rad2Deg
    }

    public get rotationZ() {
        return this.camera.rotation.z * rad2Deg
    }

    public get enableDamping() {
        return this.controls.enableDamping
    }
    public set enableDamping(val: boolean) {
        this.controls.enableDamping = val
    }

    public get enablePan() {
        return this.controls.enablePan
    }
    public set enablePan(val: boolean) {
        this.controls.enablePan = val
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

    private enabledState = new Reactive(true)
    public get enabled() {
        return this.enabledState.get()
    }
    public set enabled(val: boolean) {
        this.enabledState.set(val)
    }

    public get autoRotate() {
        return this.controls.autoRotate
    }
    public set autoRotate(val: boolean) {
        this.controls.autoRotate = val
    }

    public get autoRotateSpeed() {
        return this.controls.autoRotateSpeed
    }
    public set autoRotateSpeed(val: number) {
        this.controls.autoRotateSpeed = val
    }
    
    private _minPolarAngle = MIN_POLAR_ANGLE * deg2Rad
    public get minPolarAngle() {
        return this._minPolarAngle * rad2Deg
    }
    public set minPolarAngle(val: number) {
        this.controls.minPolarAngle = this._minPolarAngle = val * deg2Rad
    }

    private _maxPolarAngle = MAX_POLAR_ANGLE * deg2Rad
    public get maxPolarAngle() {
        return this._maxPolarAngle * rad2Deg
    }
    public set maxPolarAngle(val: number) {
        this.controls.maxPolarAngle = this._maxPolarAngle = val * deg2Rad
    }

    private _minAzimuthAngle = -Infinity
    public get minAzimuthAngle() {
        return this._minAzimuthAngle * rad2Deg
    }
    public set minAzimuthAngle(val: number) {
        this.controls.minAzimuthAngle = this._minAzimuthAngle = val * deg2Rad
    }

    private _maxAzimuthAngle = Infinity
    public get maxAzimuthAngle() {
        return this._maxAzimuthAngle * rad2Deg
    }
    public set maxAzimuthAngle(val: number) {
        this.controls.maxAzimuthAngle = this._maxAzimuthAngle = val * deg2Rad
    }

    public get azimuthAngle() {
        return this.controls.getAzimuthalAngle() * rad2Deg
    }
    public set azimuthAngle(val: number) {
        this.controls.minAzimuthAngle = this.controls.maxAzimuthAngle = val * deg2Rad
        this.controls.update()

        this.queueMicrotask(() => {
            this.controls.minAzimuthAngle = this._minAzimuthAngle
            this.controls.maxAzimuthAngle = this._maxAzimuthAngle
        })
    }

    public get polarAngle() {
        return this.controls.getPolarAngle() * rad2Deg
    }
    public set polarAngle(val: number) {
        this.controls.minPolarAngle = this.controls.maxPolarAngle = val * deg2Rad
        this.controls.update()

        this.queueMicrotask(() => {
            this.controls.minPolarAngle = this._minPolarAngle
            this.controls.maxPolarAngle = this._maxPolarAngle
        })
    }
    
    public get distance() {
        return this.controls.getDistance() * scaleUp
    }
    public set distance(val: number) {
        this.controls.minDistance = this.controls.maxDistance = val * scaleDown
        this.controls.update()

        this.queueMicrotask(() => {
            this.controls.minDistance = -Infinity
            this.controls.maxDistance = Infinity
        })
    }
}
interface OrbitCamera extends EventLoopItem, CameraMixin<PerspectiveCamera> {}
applyMixins(OrbitCamera, [CameraMixin])
export default OrbitCamera