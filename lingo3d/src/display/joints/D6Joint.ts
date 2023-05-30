import ID6Joint, {
    d6JointDefaults,
    d6JointSchema,
    D6MotionOptions
} from "../../interface/ID6Joint"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import { physxPtr } from "../../pointers/physxPtr"
import { configD6JointSystem } from "../../systems/configSystems/configD6JointSystem"

const createD6 = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    return Px.D6JointCreate(physics, actor0, pose0, actor1, pose1)
}

export default class D6Joint extends JointBase implements ID6Joint {
    public static componentName = "d6Joint"
    public static defaults = d6JointDefaults
    public static schema = d6JointSchema

    public $createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        configD6JointSystem.add(this)
        return createD6(
            fromManager.$actor,
            fromPxTransform,
            toManager.$actor,
            toPxTransform
        )
    }

    private _linearX?: D6MotionOptions
    public get linearX() {
        return this._linearX ?? "locked"
    }
    public set linearX(val) {
        this._linearX = val
        configD6JointSystem.add(this)
    }

    private _linearLimitXLow?: number
    public get linearLimitXLow() {
        return this._linearLimitXLow ?? -100
    }
    public set linearLimitXLow(val) {
        this._linearLimitXLow = val
        configD6JointSystem.add(this)
    }

    private _linearLimitXHigh?: number
    public get linearLimitXHigh() {
        return this._linearLimitXHigh ?? 100
    }
    public set linearLimitXHigh(val) {
        this._linearLimitXHigh = val
        configD6JointSystem.add(this)
    }

    private _linearStiffnessX?: number
    public get linearStiffnessX() {
        return this._linearStiffnessX ?? 0
    }
    public set linearStiffnessX(val) {
        this._linearStiffnessX = val
        configD6JointSystem.add(this)
    }

    private _linearDampingX?: number
    public get linearDampingX() {
        return this._linearDampingX ?? 0
    }
    public set linearDampingX(val) {
        this._linearDampingX = val
        configD6JointSystem.add(this)
    }

    private _linearY?: D6MotionOptions
    public get linearY() {
        return this._linearY ?? "locked"
    }
    public set linearY(val) {
        this._linearY = val
        configD6JointSystem.add(this)
    }

    private _linearLimitYLow?: number
    public get linearLimitYLow() {
        return this._linearLimitYLow ?? -100
    }
    public set linearLimitYLow(val) {
        this._linearLimitYLow = val
        configD6JointSystem.add(this)
    }

    private _linearLimitYHigh?: number
    public get linearLimitYHigh() {
        return this._linearLimitYHigh ?? 100
    }
    public set linearLimitYHigh(val) {
        this._linearLimitYHigh = val
        configD6JointSystem.add(this)
    }

    private _linearStiffnessY?: number
    public get linearStiffnessY() {
        return this._linearStiffnessY ?? 0
    }
    public set linearStiffnessY(val) {
        this._linearStiffnessY = val
        configD6JointSystem.add(this)
    }

    private _linearDampingY?: number
    public get linearDampingY() {
        return this._linearDampingY ?? 0
    }
    public set linearDampingY(val) {
        this._linearDampingY = val
        configD6JointSystem.add(this)
    }

    private _linearZ?: D6MotionOptions
    public get linearZ() {
        return this._linearZ ?? "locked"
    }
    public set linearZ(val) {
        this._linearZ = val
        configD6JointSystem.add(this)
    }

    private _linearLimitZLow?: number
    public get linearLimitZLow() {
        return this._linearLimitZLow ?? -100
    }
    public set linearLimitZLow(val) {
        this._linearLimitZLow = val
        configD6JointSystem.add(this)
    }

    private _linearLimitZHigh?: number
    public get linearLimitZHigh() {
        return this._linearLimitZHigh ?? 100
    }
    public set linearLimitZHigh(val) {
        this._linearLimitZHigh = val
        configD6JointSystem.add(this)
    }

    private _linearStiffnessZ?: number
    public get linearStiffnessZ() {
        return this._linearStiffnessZ ?? 0
    }
    public set linearStiffnessZ(val) {
        this._linearStiffnessZ = val
        configD6JointSystem.add(this)
    }

    private _linearDampingZ?: number
    public get linearDampingZ() {
        return this._linearDampingZ ?? 0
    }
    public set linearDampingZ(val) {
        this._linearDampingZ = val
        configD6JointSystem.add(this)
    }

    private _twistX?: D6MotionOptions
    public get twistX() {
        return this._twistX ?? "locked"
    }
    public set twistX(val) {
        this._twistX = val
        configD6JointSystem.add(this)
    }

    private _twistLimitLow?: number
    public get twistLimitLow() {
        return this._twistLimitLow ?? -360
    }
    public set twistLimitLow(val) {
        this._twistLimitLow = val
        configD6JointSystem.add(this)
    }

    private _twistLimitHigh?: number
    public get twistLimitHigh() {
        return this._twistLimitHigh ?? 360
    }
    public set twistLimitHigh(val) {
        this._twistLimitHigh = val
        configD6JointSystem.add(this)
    }

    private _twistStiffness?: number
    public get twistStiffness() {
        return this._twistStiffness ?? 0
    }
    public set twistStiffness(val) {
        this._twistStiffness = val
        configD6JointSystem.add(this)
    }

    private _twistDamping?: number
    public get twistDamping() {
        return this._twistDamping ?? 0
    }
    public set twistDamping(val) {
        this._twistDamping = val
        configD6JointSystem.add(this)
    }

    private _swingY?: D6MotionOptions
    public get swingY() {
        return this._swingY ?? "locked"
    }
    public set swingY(val) {
        this._swingY = val
        configD6JointSystem.add(this)
    }

    private _swingZ?: D6MotionOptions
    public get swingZ() {
        return this._swingZ ?? "locked"
    }
    public set swingZ(val) {
        this._swingZ = val
        configD6JointSystem.add(this)
    }

    private _swingStiffness?: number
    public get swingStiffness() {
        return this._swingStiffness ?? 0
    }
    public set swingStiffness(val) {
        this._swingStiffness = val
        configD6JointSystem.add(this)
    }

    private _swingDamping?: number
    public get swingDamping() {
        return this._swingDamping ?? 0
    }
    public set swingDamping(val) {
        this._swingDamping = val
        configD6JointSystem.add(this)
    }

    private _swingLimitY?: number
    public get swingLimitY() {
        return this._swingLimitY ?? 360
    }
    public set swingLimitY(val) {
        this._swingLimitY = val
        configD6JointSystem.add(this)
    }

    private _swingLimitZ?: number
    public get swingLimitZ() {
        return this._swingLimitZ ?? 360
    }
    public set swingLimitZ(val) {
        this._swingLimitZ = val
        configD6JointSystem.add(this)
    }
}
