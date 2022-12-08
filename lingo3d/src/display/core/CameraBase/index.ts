import { CameraHelper, PerspectiveCamera, Quaternion } from "three"
import ObjectManager from "../ObjectManager"
import { debounceInstance } from "@lincode/utils"
import { scaleDown } from "../../../engine/constants"
import {
    ray,
    euler,
    quaternion,
    quaternion_,
    halfPi
} from "../../utils/reusables"
import ICameraBase, { MouseControl } from "../../../interface/ICameraBase"
import { deg2Rad, Point3d } from "@lincode/math"
import { MIN_POLAR_ANGLE, MAX_POLAR_ANGLE } from "../../../globals"
import { Reactive } from "@lincode/reactivity"
import MeshItem from "../MeshItem"
import { Cancellable } from "@lincode/promiselikes"
import mainCamera from "../../../engine/mainCamera"
import scene from "../../../engine/scene"
import { pushCameraList, pullCameraList } from "../../../states/useCameraList"
import { getCameraRendered } from "../../../states/useCameraRendered"
import {
    pullCameraStack,
    pushCameraStack
} from "../../../states/useCameraStack"
import getWorldPosition from "../../utils/getWorldPosition"
import getWorldQuaternion from "../../utils/getWorldQuaternion"
import getWorldDirection from "../../utils/getWorldDirection"
import { addSelectionHelper } from "../StaticObjectManager/raycast/selectionCandidates"
import HelperSprite from "../utils/HelperSprite"
import { setManager } from "../../../api/utils/manager"

export default abstract class CameraBase<
        T extends PerspectiveCamera = PerspectiveCamera
    >
    extends ObjectManager
    implements ICameraBase
{
    protected midObject3d = this.outerObject3d

    public constructor(protected camera: T) {
        super()
        this.object3d.add(camera)
        setManager(camera, this)

        pushCameraList(camera)
        this.then(() => {
            pullCameraStack(camera)
            pullCameraList(camera)
        })

        this.createEffect(() => {
            if (
                getCameraRendered() !== mainCamera ||
                getCameraRendered() === camera
            )
                return

            const helper = new CameraHelper(camera)
            scene.add(helper)

            const sprite = new HelperSprite("camera")
            const handle = addSelectionHelper(sprite, this)
            helper.add(sprite.outerObject3d)
            return () => {
                helper.dispose()
                scene.remove(helper)
                handle.cancel()
            }
        }, [getCameraRendered])
    }

    public override lookAt(target: MeshItem | Point3d): void
    public override lookAt(x: number, y: number | undefined, z: number): void
    public override lookAt(a0: any, a1?: any, a2?: any) {
        super.lookAt(a0, a1, a2)
        const angle = euler.setFromQuaternion(this.outerObject3d.quaternion)
        angle.x += Math.PI
        angle.z += Math.PI
        this.outerObject3d.setRotationFromEuler(angle)
    }

    public get fov() {
        return this.camera.fov
    }
    public set fov(val) {
        this.camera.fov = val
        this.camera.updateProjectionMatrix?.()
    }

    public get zoom() {
        return this.camera.zoom
    }
    public set zoom(val) {
        this.camera.zoom = val
        this.camera.updateProjectionMatrix?.()
    }

    public get near() {
        return this.camera.near
    }
    public set near(val) {
        this.camera.near = val
        this.camera.updateProjectionMatrix?.()
    }

    public get far() {
        return this.camera.far
    }
    public set far(val) {
        this.camera.far = val
        this.camera.updateProjectionMatrix?.()
    }

    private _active?: boolean
    public get active() {
        return !!this._active
    }
    public set active(val) {
        this._active = val
        pullCameraStack(this.camera)
        val && pushCameraStack(this.camera)
    }

    public get transition() {
        return this.camera.userData.transition as boolean | number | undefined
    }
    public set transition(val) {
        this.camera.userData.transition = val
    }

    protected override getRay() {
        return ray.set(
            getWorldPosition(this.camera),
            getWorldDirection(this.camera)
        )
    }

    public override append(object: MeshItem) {
        this._append(object)
        this.camera.add(object.outerObject3d)
    }

    public override attach(object: MeshItem) {
        this._append(object)
        this.camera.attach(object.outerObject3d)
    }

    public override get width() {
        return super.width
    }
    public override set width(val) {
        const num = val * scaleDown
        this.object3d.scale.x = num
        this.camera.scale.x = 1 / num
    }

    public override get height() {
        return super.height
    }
    public override set height(val) {
        const num = val * scaleDown
        this.object3d.scale.y = num
        this.camera.scale.y = 1 / num
    }

    public override get depth() {
        return super.depth
    }
    public override set depth(val) {
        const num = val * scaleDown
        this.object3d.scale.z = num
        this.camera.scale.z = 1 / num
    }

    protected orbitMode?: boolean

    private _gyrate(movementX: number, movementY: number, inner?: boolean) {
        const manager = inner ? this.object3d : this.midObject3d
        euler.setFromQuaternion(manager.quaternion)

        euler.y -= movementX * 0.002
        euler.y = Math.max(
            halfPi - this._maxAzimuthAngle * deg2Rad,
            Math.min(halfPi - this._minAzimuthAngle * deg2Rad, euler.y)
        )

        euler.x -= movementY * 0.002
        euler.x = Math.max(
            halfPi - this._maxPolarAngle * deg2Rad,
            Math.min(halfPi - this._minPolarAngle * deg2Rad, euler.x)
        )

        manager.setRotationFromEuler(euler)
        !inner && this.rotationUpdate?.updateXYZ()
    }

    private gyrateHandle?: Cancellable
    public gyrate(movementX: number, movementY: number, noDamping?: boolean) {
        if (this.enableDamping) {
            movementX *= 0.5
            movementY *= 0.5
        }
        if (this.orbitMode) this._gyrate(movementX, movementY)
        else {
            this._gyrate(movementX, 0)
            this._gyrate(0, movementY, true)
        }
        if (!this.enableDamping || noDamping || !(movementX || movementY))
            return

        this.gyrateHandle?.cancel()

        let factor = 1
        const handle = (this.gyrateHandle = this.beforeRender(() => {
            factor *= 0.95
            this._gyrate(movementX * factor, movementY * factor)
            factor <= 0.001 && handle.cancel()
        }))
    }

    private static updateAngle = debounceInstance((target: CameraBase) =>
        target.gyrate(0, 0)
    )
    protected updateAngle() {
        CameraBase.updateAngle(this, this)
    }

    private _minPolarAngle = MIN_POLAR_ANGLE
    public get minPolarAngle() {
        return this._minPolarAngle
    }
    public set minPolarAngle(val) {
        this._minPolarAngle = val
        this.updateAngle()
    }

    private _maxPolarAngle = MAX_POLAR_ANGLE
    public get maxPolarAngle() {
        return this._maxPolarAngle
    }
    public set maxPolarAngle(val) {
        this._maxPolarAngle = val
        this.updateAngle()
    }

    private _minAzimuthAngle = -Infinity
    public get minAzimuthAngle() {
        return this._minAzimuthAngle
    }
    public set minAzimuthAngle(val) {
        this._minAzimuthAngle = val
        this.updateAngle()
    }

    private _maxAzimuthAngle = Infinity
    public get maxAzimuthAngle() {
        return this._maxAzimuthAngle
    }
    public set maxAzimuthAngle(val) {
        this._maxAzimuthAngle = val
        this.updateAngle()
    }

    public setPolarAngle(angle: number) {
        const { _minPolarAngle, _maxPolarAngle } = this
        this.minPolarAngle = this.maxPolarAngle = angle
        this.queueMicrotask(() => {
            this.minPolarAngle = _minPolarAngle
            this.maxPolarAngle = _maxPolarAngle
        })
    }

    public setAzimuthAngle(angle: number) {
        const { _minAzimuthAngle, _maxAzimuthAngle } = this
        this.minAzimuthAngle = this.maxAzimuthAngle = angle
        this.queueMicrotask(() => {
            this.minAzimuthAngle = _minAzimuthAngle
            this.maxAzimuthAngle = _maxAzimuthAngle
        })
    }

    private _polarAngle?: number
    public get polarAngle() {
        return this._polarAngle
    }
    public set polarAngle(val) {
        this._polarAngle = val
        val && this.setPolarAngle(val)
    }

    private _azimuthAngle?: number
    public get azimuthAngle() {
        return this._azimuthAngle
    }
    public set azimuthAngle(val) {
        this._azimuthAngle = val
        val && this.setAzimuthAngle(val)
    }

    public enableDamping = false

    protected mouseControlState = new Reactive<MouseControl>(false)
    private mouseControlInit?: boolean
    public get mouseControl() {
        return this.mouseControlState.get()
    }
    public set mouseControl(val) {
        this.mouseControlState.set(val)

        if (!val || this.mouseControlInit) return
        this.mouseControlInit = true

        import("./enableMouseControl").then((module) =>
            module.default.call(this)
        )
    }

    private _gyroControl?: boolean
    public get gyroControl() {
        return !!this._gyroControl
    }
    public set gyroControl(val) {
        this._gyroControl = val

        const deviceEuler = euler
        const deviceQuaternion = quaternion
        const screenTransform = quaternion_
        const worldTransform = new Quaternion(
            -Math.sqrt(0.5),
            0,
            0,
            Math.sqrt(0.5)
        )

        const quat = getWorldQuaternion(this.object3d)
        const orient = 0

        const cb = (e: DeviceOrientationEvent) => {
            this.object3d.quaternion.copy(quat)
            deviceEuler.set(
                (e.beta ?? 0) * deg2Rad,
                (e.alpha ?? 0) * deg2Rad,
                -(e.gamma ?? 0) * deg2Rad,
                "YXZ"
            )

            this.object3d.quaternion.multiply(
                deviceQuaternion.setFromEuler(deviceEuler)
            )

            const minusHalfAngle = -orient * 0.5
            screenTransform.set(
                0,
                Math.sin(minusHalfAngle),
                0,
                Math.cos(minusHalfAngle)
            )

            this.object3d.quaternion.multiply(screenTransform)
            this.object3d.quaternion.multiply(worldTransform)
        }
        val && window.addEventListener("deviceorientation", cb)
        this.cancelHandle(
            "gyroControl",
            val &&
                (() =>
                    new Cancellable(() =>
                        window.removeEventListener("deviceorientation", cb)
                    ))
        )
    }
}
