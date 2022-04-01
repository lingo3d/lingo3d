import { deg2Rad, rad2Deg } from "@lincode/math"
import { Reactive } from "@lincode/reactivity"
import { applyMixins, debounce } from "@lincode/utils"
import { PerspectiveCamera, Vector3 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { camFar, camNear, scaleDown, scaleUp } from "../../engine/constants"
import { container } from "../../engine/render/renderSetup"
import { getCamera } from "../../states/useCamera"
import EventLoopItem from "../../api/core/EventLoopItem"
import CameraMixin from "../core/mixins/CameraMixin"
import IOrbitCamera, { orbitCameraDefaults } from "../../interface/IOrbitCamera"
import { loop } from "../../engine/eventLoop"
import ObjectManager from "../core/ObjectManager"
import { getOrbitControlsEnabled } from "../../states/useOrbitControlsEnabled"
import { vector3 } from "../utils/reusables"
import { emitOrbitControls } from "../../events/onOrbitControls"
import { setSelectionEnabled } from "../../states/useSelectionEnabled"
import mainCamera from "../../engine/mainCamera"

class OrbitCamera extends EventLoopItem implements IOrbitCamera {
    public static componentName = "orbitCamera"
    public static defaults = orbitCameraDefaults

    public outerObject3d: PerspectiveCamera
    private controls: OrbitControls

    private updateDebounced = debounce(() => this.controls.update(), 0, "trailing")

    public constructor(
        protected camera = new PerspectiveCamera(75, 1, camNear, camFar)
    ) {
        super()
        this.outerObject3d = camera
        const controls = this.controls = new OrbitControls(camera, container)

        controls.enabled = false
        controls.enablePan = false
        controls.enableZoom = false

        this.initOuterObject3d()
        this.initCamera()

        camera.position.z = 5
        this.updateDebounced()

        this.createEffect(() => {
            if (!getOrbitControlsEnabled() || getCamera() !== camera || !this.enabledState.get()) return

            controls.enabled = true
            const handle = loop(this.updateDebounced)

            if (this.enableZoomState.get()) {
                const cb = (e: WheelEvent) => {
                    e.preventDefault()

                    const direction = camera.getWorldDirection(vector3)
                    let pt = camera.position.clone().add(direction.clone().multiplyScalar(-e.deltaY * scaleDown))

                    const localPt = camera.worldToLocal(pt.clone())
                    const localTarget = camera.worldToLocal(controls.target.clone())
                    
                    if (localPt.z - localTarget.z <= 0)
                        pt = controls.target.clone().add(direction.multiplyScalar(-0.001))

                    camera.position.copy(pt)
                    this.updateDebounced()
                }
                container.addEventListener("wheel", cb)
                handle.then(() => container.removeEventListener("wheel", cb))
            }
            return () => {
                controls.enabled = false
                handle.cancel()
            }
        }, [getCamera, getOrbitControlsEnabled, this.enableZoomState.get, this.enabledState.get])

        let azimuthStart = 0
        let polarStart = 0
        let targetStart = vector3
        let started = false

        controls.addEventListener("start", () => {
            started = true
            azimuthStart = controls.getAzimuthalAngle() * rad2Deg
            polarStart = controls.getPolarAngle() * rad2Deg
            targetStart = controls.target.clone()
            camera === mainCamera && emitOrbitControls("start")
        })

        controls.addEventListener("change", () => {
            if (!started) return
            const azimuthDiff = Math.abs(controls.getAzimuthalAngle() * rad2Deg - azimuthStart)
            const polarDiff = Math.abs(controls.getPolarAngle() * rad2Deg - polarStart)
        
            const { x, y, z } = controls.target
            const { x: x0, y: y0, z: z0 } = targetStart
            const targetDiff = Math.max(Math.abs(x0 - x), Math.abs(y0 - y), Math.abs(z0 - z))
        
            if (azimuthDiff > 2 || polarDiff > 2 || targetDiff > 0.02) {
                setSelectionEnabled(false)
                camera === mainCamera && emitOrbitControls("move")
            }
        })
        
        controls.addEventListener("end", () => {
            started = false
            setSelectionEnabled(true)
            camera === mainCamera && emitOrbitControls("stop")
        })

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

    protected _target: ObjectManager | undefined
    public get target() {
        return this._target
    }
    public set target(target: ObjectManager | undefined) {
        this._target = target
        this.controls.target = target?.outerObject3d.position ?? new Vector3()
    }

    public override append(object: ObjectManager) {
        if (this._target) {
            super.append(object)
            return
        }
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

    public setRotationY(val: number, lock?: boolean) {
        this.controls.minAzimuthAngle = this.controls.maxAzimuthAngle = val * deg2Rad
        this.controls.update()

        if (lock) return

        this.queueMicrotask(() => {
            this.controls.minAzimuthAngle = -Infinity
            this.controls.maxAzimuthAngle = Infinity
        })
    }

    public setRotationX(val: number, lock?: boolean) {
        this.controls.minPolarAngle = this.controls.maxPolarAngle = (val + 90) * deg2Rad
        this.controls.update()

        if (lock) return

        this.queueMicrotask(() => {
            this.controls.minPolarAngle = -Infinity
            this.controls.maxPolarAngle = Infinity
        })
    }

    public setDistance(val: number, lock?: boolean) {
        this.controls.minDistance = this.controls.maxDistance = val * scaleDown
        this.controls.update()

        if (lock) {
            this.enableZoom = false
            return
        }

        this.queueMicrotask(() => {
            this.controls.minDistance = -Infinity
            this.controls.maxDistance = Infinity
        })
    }
}
interface OrbitCamera extends EventLoopItem, CameraMixin<PerspectiveCamera> {}
applyMixins(OrbitCamera, [CameraMixin])
export default OrbitCamera