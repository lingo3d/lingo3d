import { Camera, Group } from "three"
import ObjectManager from "../ObjectManager"
import { deg2Rad, rad2Deg } from "@lincode/math"
import CameraMixin from "../mixins/CameraMixin"
import { applyMixins } from "@lincode/utils"
import SimpleObjectManager from "../SimpleObjectManager"
import Point3d from "../../../api/Point3d"
import { scaleUp, scaleDown } from "../../../engine/constants"
import { ray, vector3_, vector3, euler } from "../../utils/reusables"
import pillShape from "../SimpleObjectManager/PhysicsItem/cannon/shapes/pillShape"
import ICameraBase, { MouseControl, MouseControlMode } from "../../../interface/ICameraBase"
import { Cancellable } from "@lincode/promiselikes"

const PI_2 = Math.PI * 0.5

abstract class CameraBase<T extends Camera> extends ObjectManager<Group> implements ICameraBase {
    protected camera: T

    protected override _physicsShape = pillShape

    public constructor(camera: T) {
        super(new Group())
        this.camera = camera
        this.object3d.add(camera)
        this.initCamera()
    }

    protected override getRay() {
        return ray.set(this.camera.getWorldPosition(vector3_), this.camera.getWorldDirection(vector3))
    }

    public override append(object: SimpleObjectManager) {
        this.camera.add(object.outerObject3d)
    }

    public override get width() {
        return this.object3d.scale.x * scaleUp
    }
    public override set width(val: number) {
        const num = val * scaleDown
        this.object3d.scale.x = num
        this.camera.scale.x = 1 / num
    }

    public override get height() {
        return this.object3d.scale.y * scaleUp
    }
    public override set height(val: number) {
        const num = val * scaleDown
        this.object3d.scale.y = num
        this.camera.scale.y = 1 / num
    }

    public override get depth() {
        return this.object3d.scale.z * scaleUp
    }
    public override set depth(val: number) {
        const num = val * scaleDown
        this.object3d.scale.z = num
        this.camera.scale.z = 1 / num
    }

    public override lookAt(target: SimpleObjectManager | Point3d) {
        super.lookAt(target)
        this.rotationY += 180
    }

    private _minPolarAngle = 5 * deg2Rad
    private _maxPolarAngle = 175 * deg2Rad

    public get minPolarAngle() {
        return this._minPolarAngle * rad2Deg
    }
    public set minPolarAngle(val: number) {
        this._minPolarAngle = val * deg2Rad
    }

    public get maxPolarAngle() {
        return this._maxPolarAngle * rad2Deg
    }
    public set maxPolarAngle(val: number) {
        this._maxPolarAngle = val * deg2Rad
    }

    public gyrate(movementX: number, movementY: number, inner?: boolean) {
        const manager = inner ? this.object3d : this.outerObject3d

        euler.setFromQuaternion(manager.quaternion)

        euler.y -= movementX * 0.002
        euler.x -= movementY * 0.002

        euler.x = Math.max(PI_2 - this._maxPolarAngle, Math.min(PI_2 - this._minPolarAngle, euler.x))

        manager.quaternion.setFromEuler(euler)
        !inner && this.physicsRotate()
    }

    public mouseControlMode?: MouseControlMode

    private mouseControlHandle: Cancellable | undefined
    private _mouseControl?: MouseControl

    public get mouseControl() {
        return this._mouseControl
    }
    public set mouseControl(val: MouseControl | undefined) {
        if (this._mouseControl === val) return
        this._mouseControl = val
        
        this.mouseControlHandle?.cancel()
        if (!val) return

        const handle = this.mouseControlHandle = this.cancellable()
        import("./enableMouseControl").then(module => module.default.call(this, handle))
    }
}
interface CameraBase<T extends Camera> extends ObjectManager<Group>, CameraMixin<T> {}
applyMixins(CameraBase, [CameraMixin])
export default CameraBase