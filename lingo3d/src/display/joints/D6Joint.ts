import { deg2Rad } from "@lincode/math"
import ID6Joint, {
    d6JointDefaults,
    d6JointSchema,
    D6Motion
} from "../../interface/ID6Joint"
import { physXPtr } from "../../states/usePhysX"
import debounceSystem from "../../utils/debounceSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"

const createD6 = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physXPtr[0]
    return Px.D6JointCreate(physics, actor0, pose0, actor1, pose1)
}

const stringToMotion = (val?: D6Motion) => {
    const { PxD6MotionEnum } = physXPtr[0]
    switch (val) {
        case "locked":
            return PxD6MotionEnum.eLOCKED()
        case "limited":
            return PxD6MotionEnum.eLIMITED()
        case "free":
            return PxD6MotionEnum.eFREE()
        default:
            return PxD6MotionEnum.eFREE()
    }
}

const configJointSystem = debounceSystem((target: D6Joint) => {
    const { joint } = target
    const { PxD6AxisEnum, PxJointLimitCone, PxJointAngularLimitPair } =
        physXPtr[0]
    const {
        slideX,
        slideY,
        slideZ,
        swingY,
        swingZ,
        twist,
        twistLimitLow,
        twistLimitHigh,
        swingLimitY,
        swingLimitZ
    } = target

    slideX !== undefined &&
        joint.setMotion(PxD6AxisEnum.eX(), stringToMotion(slideX))
    slideY !== undefined &&
        joint.setMotion(PxD6AxisEnum.eY(), stringToMotion(slideY))
    slideZ !== undefined &&
        joint.setMotion(PxD6AxisEnum.eZ(), stringToMotion(slideZ))
    swingY !== undefined &&
        joint.setMotion(PxD6AxisEnum.eSWING1(), stringToMotion(swingY))
    swingZ !== undefined &&
        joint.setMotion(PxD6AxisEnum.eSWING2(), stringToMotion(swingZ))
    twist !== undefined &&
        joint.setMotion(PxD6AxisEnum.eTWIST(), stringToMotion(twist))

    if (swingY === "limited" || swingZ === "limited") {
        const limitCone = new PxJointLimitCone(
            swingLimitY * deg2Rad,
            swingLimitZ * deg2Rad
        )
        joint.setSwingLimit(limitCone)
        destroy(limitCone)
    }
    if (twist === "limited") {
        const limitPair = new PxJointAngularLimitPair(
            twistLimitLow * deg2Rad,
            twistLimitHigh * deg2Rad
        )
        joint.setTwistLimit(limitPair)
        destroy(limitPair)
    }
})

export default class D6Joint extends JointBase implements ID6Joint {
    public static componentName = "d6Joint"
    public static defaults = d6JointDefaults
    public static schema = d6JointSchema

    public joint: any

    protected override onCreateJoint() {
        configJointSystem(this)
    }

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        return (this.joint = createD6(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        ))
    }

    private _eX?: D6Motion
    public get slideX() {
        return this._eX
    }
    public set slideX(val) {
        this._eX = val
        configJointSystem(this)
    }

    private _eY?: D6Motion
    public get slideY() {
        return this._eY
    }
    public set slideY(val) {
        this._eY = val
        configJointSystem(this)
    }

    private _eZ?: D6Motion
    public get slideZ() {
        return this._eZ
    }
    public set slideZ(val) {
        this._eZ = val
        configJointSystem(this)
    }

    private _swingY?: D6Motion
    public get swingY() {
        return this._swingY
    }
    public set swingY(val) {
        this._swingY = val
        configJointSystem(this)
    }

    private _swingZ?: D6Motion
    public get swingZ() {
        return this._swingZ
    }
    public set swingZ(val) {
        this._swingZ = val
        configJointSystem(this)
    }

    private _twist?: D6Motion
    public get twist() {
        return this._twist
    }
    public set twist(val) {
        this._twist = val
        configJointSystem(this)
    }

    private _twistLimitLow?: number
    public get twistLimitLow() {
        return this._twistLimitLow ?? -360
    }
    public set twistLimitLow(val) {
        this._twistLimitLow = val
        configJointSystem(this)
    }

    private _twistLimitHigh?: number
    public get twistLimitHigh() {
        return this._twistLimitHigh ?? 360
    }
    public set twistLimitHigh(val) {
        this._twistLimitHigh = val
        configJointSystem(this)
    }

    private _swingLimitY?: number
    public get swingLimitY() {
        return this._swingLimitY ?? 360
    }
    public set swingLimitY(val) {
        this._swingLimitY = val
        configJointSystem(this)
    }

    private _swingLimitZ?: number
    public get swingLimitZ() {
        return this._swingLimitZ ?? 360
    }
    public set swingLimitZ(val) {
        this._swingLimitZ = val
        configJointSystem(this)
    }
}
