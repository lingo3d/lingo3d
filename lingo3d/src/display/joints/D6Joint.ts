import { deg2Rad } from "@lincode/math"
import { PI2 } from "../../globals"
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
    const { PxD6AxisEnum, PxJointLimitCone } = physXPtr[0]
    const {
        slideX,
        slideY,
        slideZ,
        swingY,
        swingZ,
        twistX,
        twistLimitY,
        twistLimitZ,
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
    twistX !== undefined &&
        joint.setMotion(PxD6AxisEnum.eTWIST(), stringToMotion(twistX))

    if (swingY === "limited" || swingZ === "limited") {
        const limitCone = new PxJointLimitCone(
            swingLimitY * deg2Rad,
            swingLimitZ * deg2Rad
        )
        joint.setSwingLimit(limitCone)
        destroy(limitCone)
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

    private _twistX?: D6Motion
    public get twistX() {
        return this._twistX
    }
    public set twistX(val) {
        this._twistX = val
        configJointSystem(this)
    }

    private _twistLimitY?: number
    public get twistLimitY() {
        return this._twistLimitY ?? 360
    }
    public set twistLimitY(val) {
        this._twistLimitY = val
        configJointSystem(this)
    }

    private _twistLimitZ?: number
    public get twistLimitZ() {
        return this._twistLimitZ ?? 360
    }
    public set twistLimitZ(val) {
        this._twistLimitZ = val
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
