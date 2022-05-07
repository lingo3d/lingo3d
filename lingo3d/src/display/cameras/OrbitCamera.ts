import { deg2Rad, rad2Deg } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { applyMixins, debounce } from "@lincode/utils"
import { PerspectiveCamera, Vector3 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { camFar, camNear, scaleDown, scaleUp } from "../../engine/constants"
import { container } from "../../engine/renderLoop/renderSetup"
import { getCamera } from "../../states/useCamera"
import EventLoopItem from "../../api/core/EventLoopItem"
import CameraMixin from "../core/mixins/CameraMixin"
import IOrbitCamera, { orbitCameraDefaults, orbitCameraSchema } from "../../interface/IOrbitCamera"
import { loop } from "../../engine/eventLoop"
import ObjectManager from "../core/ObjectManager"
import { vector3 } from "../utils/reusables"
import { MIN_POLAR_ANGLE, MAX_POLAR_ANGLE } from "../../globals"
import { getTransformControlsDragging } from "../../states/useTransformControlsDragging"
import SimpleObjectManager from "../core/SimpleObjectManager"

class OrbitCamera extends EventLoopItem implements IOrbitCamera {
    public static componentName = "orbitCamera"
    public static defaults = orbitCameraDefaults
    public static schema = orbitCameraSchema

    private controls: OrbitControls

    private updateDebounced = debounce(() => this.controls.update(), 0, "trailing")

    public constructor(
        protected camera = new PerspectiveCamera(75, 1, camNear, camFar)
    ) {
        super(camera)
        const controls = this.controls = new OrbitControls(camera, container)

        this.initCamera()

        controls.enabled = false
        controls.enablePan = false
        controls.enableZoom = false
        controls.minPolarAngle = this._minPolarAngle
        controls.maxPolarAngle = this._maxPolarAngle
        controls.minAzimuthAngle = this._minAzimuthAngle
        controls.maxAzimuthAngle = this._maxAzimuthAngle

        camera.position.z = 5
        this.updateDebounced()

        this.createEffect(() => {
            if (getTransformControlsDragging() || getCamera() !== camera || !this.enabledState.get())
                return

            controls.enabled = true
            const handle = loop(this.updateDebounced)

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
                    this.updateDebounced()
                }
                container.addEventListener("wheel", cb)
                handle.then(() => container.removeEventListener("wheel", cb))
            }
            if (this.enableFlyState.get()) {
                const downSet = new Set<string>()

                const moveForward = (distance: number) => {
                    const direction = camera.getWorldDirection(vector3)
                    camera.position.add(direction.clone().multiplyScalar(distance * scaleDown))
                    this.controls.target.copy(camera.position).add(direction)
                    this.updateDebounced()
                }
                const moveRight = (distance: number) => {
                    vector3.setFromMatrixColumn(this.outerObject3d.matrix, 0)
                    camera.position.addScaledVector(vector3, distance * scaleDown)
                    this.controls.target.addScaledVector(vector3, distance * scaleDown)
                    this.updateDebounced()
                }
                handle.watch(loop(() => {
                    if (downSet.has("w") || downSet.has("ArrowUp"))
                        moveForward(10)
                    else if (downSet.has("s") || downSet.has("ArrowDown"))
                        moveForward(-10)

                    if (downSet.has("a") || downSet.has("ArrowLeft"))
                        moveRight(-10)
                    else if (downSet.has("d") || downSet.has("ArrowRight"))
                        moveRight(10)
                }))

                const handleKeyDown = (e: KeyboardEvent) => {
                    downSet.add(e.key)
                }
                const handleKeyUp = (e: KeyboardEvent) => {
                    downSet.delete(e.key)
                }
                document.addEventListener("keydown", handleKeyDown)
                document.addEventListener("keyup", handleKeyUp)

                handle.then(() => {
                    document.removeEventListener("keydown", handleKeyDown)
                    document.removeEventListener("keyup", handleKeyUp)
                })
            }
            return () => {
                controls.enabled = false
                handle.cancel()
            }
        }, [getCamera, getTransformControlsDragging, this.enableZoomState.get, this.enableFlyState.get, this.enabledState.get])

        this.then(() => controls.dispose())
    }

    private _targetX?: number
    public get targetX() {
        return this._targetX ??= 0
    }
    public set targetX(val: number) {
        this._targetX = val
        this.controls.target.x = val * scaleDown
    }

    private _targetY?: number
    public get targetY() {
        return this._targetY ??= 0
    }
    public set targetY(val: number) {
        this._targetY = val
        this.controls.target.y = val * scaleDown
    }
    
    private _targetZ?: number
    public get targetZ() {
        return this._targetZ ??= 0
    }
    public set targetZ(val: number) {
        this._targetZ = val
        this.controls.target.z = val * scaleDown
    }

    protected _target: SimpleObjectManager | undefined
    public get target() {
        return this._target
    }
    public set target(target: SimpleObjectManager | undefined) {
        this._target = target
        this.controls.target = target?.outerObject3d.position ?? new Vector3()
    }

    public override append(object: ObjectManager) {
        if (this._target) {
            super.append(object)
            return
        }
        this._append(object)
        this.outerObject3d.parent?.add(object.outerObject3d)
        this.target = object
    }

    public get x() {
        return this.camera.position.x * scaleUp
    }
    public set x(val: number) {
        this.camera.position.x = val * scaleDown
    }

    public get y() {
        return this.camera.position.y * scaleUp
    }
    public set y(val: number) {
        this.camera.position.y = val * scaleDown
    }

    public get z() {
        return this.camera.position.z * scaleUp
    }
    public set z(val: number) {
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