import { CameraHelper, PerspectiveCamera } from "three"
import GimbalObjectManager from "../GimbalObjectManager"
import { ray, euler } from "../../utils/reusables"
import ICameraBase, { MouseControl } from "../../../interface/ICameraBase"
import { deg2Rad } from "@lincode/math"
import { MIN_POLAR_ANGLE, MAX_POLAR_ANGLE, PI, PI_HALF } from "../../../globals"
import { Reactive } from "@lincode/reactivity"
import scene from "../../../engine/scene"
import { pushCameraList, pullCameraList } from "../../../states/useCameraList"
import {
    pullCameraStack,
    pushCameraStack
} from "../../../states/useCameraStack"
import getWorldPosition from "../../../memo/getWorldPosition"
import getWorldDirection from "../../../memo/getWorldDirection"
import HelperSprite from "../utils/HelperSprite"
import { setManager } from "../utils/getManager"
import MeshAppendable from "../MeshAppendable"
import { getCameraRendered } from "../../../states/useCameraRendered"
import { cameraRenderedPtr } from "../../../pointers/cameraRenderedPtr"
import { Point3dType } from "../../../typeGuards/isPoint"
import { ssrExcludeSet } from "../../../collections/ssrExcludeSet"
import { cameraTransitionSet } from "../../../collections/cameraTransitionSet"
import { renderCheckExcludeSet } from "../../../collections/renderCheckExcludeSet"
import { configCameraSystem } from "../../../systems/configSystems/configCameraSystem"
import { gyrateResetSystem } from "../../../systems/configSystems/gyrateResetSystem"
import { getWorldMode } from "../../../states/useWorldMode"
import { worldModePtr } from "../../../pointers/worldModePtr"

export default abstract class CameraBase<
        T extends PerspectiveCamera = PerspectiveCamera
    >
    extends GimbalObjectManager
    implements ICameraBase
{
    public $midObject3d = this.$object

    public constructor(public $camera: T) {
        super()
        this.$innerObject.add($camera)
        setManager($camera, this)
        pushCameraList($camera)

        this.createEffect(() => {
            if (
                worldModePtr[0] !== "editor" ||
                cameraRenderedPtr[0] === $camera ||
                this.$disableSceneGraph
            )
                return

            const helper = new CameraHelper($camera)
            ssrExcludeSet.add(helper)
            renderCheckExcludeSet.add(helper)
            scene.add(helper)

            const sprite = new HelperSprite("camera", this)
            helper.add(sprite.$object)
            return () => {
                helper.dispose()
                ssrExcludeSet.delete(helper)
                renderCheckExcludeSet.delete(helper)
                scene.remove(helper)
                sprite.dispose()
            }
        }, [getWorldMode, getCameraRendered])
    }

    protected override disposeNode(): void {
        super.disposeNode()
        pullCameraStack(this.$camera)
        pullCameraList(this.$camera)
    }

    public override lookAt(target: MeshAppendable | Point3dType): void
    public override lookAt(x: number, y: number | undefined, z: number): void
    public override lookAt(a0: any, a1?: any, a2?: any) {
        super.lookAt(a0, a1, a2)
        const angle = euler.setFromQuaternion(this.quaternion)
        angle.x += PI
        angle.z += PI
        this.$object.setRotationFromEuler(angle)
    }

    private _fov = 75
    public get fov() {
        return this._fov
    }
    public set fov(val) {
        this._fov = val
        configCameraSystem.add(this)
    }

    private _zoom = 1
    public get zoom() {
        return this._zoom
    }
    public set zoom(val) {
        this._zoom = val
        configCameraSystem.add(this)
    }

    private _active?: boolean
    public get active() {
        return !!this._active
    }
    public set active(val) {
        this._active = val
        pullCameraStack(this.$camera)
        val && pushCameraStack(this.$camera)
    }

    public get transition() {
        return cameraTransitionSet.has(this.$camera)
    }
    public set transition(val) {
        val
            ? cameraTransitionSet.add(this.$camera)
            : cameraTransitionSet.delete(this.$camera)
    }

    protected override getRay() {
        return ray.set(
            getWorldPosition(this.$camera),
            getWorldDirection(this.$camera)
        )
    }

    protected orbitMode?: boolean

    private _gyrate(movementX: number, movementY: number, inner?: boolean) {
        const manager = inner ? this.$innerObject : this.$midObject3d
        euler.setFromQuaternion(manager.quaternion)

        euler.y -= movementX * 0.002
        euler.y = Math.max(
            PI_HALF - this._maxAzimuthAngle * deg2Rad,
            Math.min(PI_HALF - this._minAzimuthAngle * deg2Rad, euler.y)
        )
        euler.x -= movementY * 0.002
        euler.x = Math.max(
            PI_HALF - this._maxPolarAngle * deg2Rad,
            Math.min(PI_HALF - this._minPolarAngle * deg2Rad, euler.x)
        )
        manager.setRotationFromEuler(euler)
    }

    public gyrate(movementX: number, movementY: number) {
        if (this.orbitMode) {
            this._gyrate(movementX, movementY)
            return
        }
        this._gyrate(movementX, 0)
        this._gyrate(0, movementY, true)
    }

    private _minPolarAngle = MIN_POLAR_ANGLE
    public get minPolarAngle() {
        return this._minPolarAngle
    }
    public set minPolarAngle(val) {
        this._minPolarAngle = val
        gyrateResetSystem.add(this)
    }

    private _maxPolarAngle = MAX_POLAR_ANGLE
    public get maxPolarAngle() {
        return this._maxPolarAngle
    }
    public set maxPolarAngle(val) {
        this._maxPolarAngle = val
        gyrateResetSystem.add(this)
    }

    private _minAzimuthAngle = -Infinity
    public get minAzimuthAngle() {
        return this._minAzimuthAngle
    }
    public set minAzimuthAngle(val) {
        this._minAzimuthAngle = val
        gyrateResetSystem.add(this)
    }

    private _maxAzimuthAngle = Infinity
    public get maxAzimuthAngle() {
        return this._maxAzimuthAngle
    }
    public set maxAzimuthAngle(val) {
        this._maxAzimuthAngle = val
        gyrateResetSystem.add(this)
    }

    public setPolarAngle(angle: number) {
        const { _minPolarAngle, _maxPolarAngle } = this
        this.minPolarAngle = this.maxPolarAngle = angle
        queueMicrotask(() => {
            if (this.done) return
            this.minPolarAngle = _minPolarAngle
            this.maxPolarAngle = _maxPolarAngle
        })
    }

    public setAzimuthAngle(angle: number) {
        const { _minAzimuthAngle, _maxAzimuthAngle } = this
        this.minAzimuthAngle = this.maxAzimuthAngle = angle
        queueMicrotask(() => {
            if (this.done) return
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

    public inertia = false

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
}
