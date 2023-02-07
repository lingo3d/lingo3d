import { deg2Rad } from "@lincode/math"
import { assertExhaustive } from "@lincode/utils"
import { CM2M } from "../../globals"
import ID6Joint, {
    d6JointDefaults,
    d6JointSchema,
    D6MotionOptions
} from "../../interface/ID6Joint"
import throttleSystem from "../../utils/throttleSystem"
import JointBase from "../core/JointBase"
import PhysicsObjectManager from "../core/PhysicsObjectManager"
import destroy from "../core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"

const createD6 = (actor0: any, pose0: any, actor1: any, pose1: any) => {
    const { physics, Px } = physxPtr[0]
    return Px.D6JointCreate(physics, actor0, pose0, actor1, pose1)
}

const getMotion = (val: D6MotionOptions) => {
    const { PxD6MotionEnum } = physxPtr[0]
    switch (val) {
        case "locked":
            return PxD6MotionEnum.eLOCKED()
        case "limited":
            return PxD6MotionEnum.eLIMITED()
        case "free":
            return PxD6MotionEnum.eFREE()
        default:
            assertExhaustive(val)
    }
}

const configJointSystem = throttleSystem((target: D6Joint) => {
    const { pxJoint } = target
    if (!pxJoint) return

    const {
        PxD6AxisEnum,
        PxJointLimitCone,
        PxJointAngularLimitPair,
        PxJointLinearLimitPair
    } = physxPtr[0]
    const {
        linearX,
        linearY,
        linearZ,
        linearLimitXLow,
        linearLimitXHigh,
        linearLimitYLow,
        linearLimitYHigh,
        linearLimitZLow,
        linearLimitZHigh,
        linearStiffnessX,
        linearStiffnessY,
        linearStiffnessZ,
        linearDampingX,
        linearDampingY,
        linearDampingZ,
        twistX,
        swingY,
        swingZ,
        twistLimitLow,
        twistLimitHigh,
        swingLimitY,
        swingLimitZ,
        twistStiffness,
        twistDamping,
        swingStiffness,
        swingDamping
    } = target

    pxJoint.setMotion(PxD6AxisEnum.eX(), getMotion(linearX))
    pxJoint.setMotion(PxD6AxisEnum.eY(), getMotion(linearY))
    pxJoint.setMotion(PxD6AxisEnum.eZ(), getMotion(linearZ))

    if (linearX === "limited") {
        const linearLimit = new PxJointLinearLimitPair(
            linearLimitXLow * CM2M,
            linearLimitXHigh * CM2M
        )
        linearLimit.stiffness = linearStiffnessX
        linearLimit.damping = linearDampingX
        pxJoint.setLinearLimit(PxD6AxisEnum.eX(), linearLimit)
        destroy(linearLimit)
    }
    if (linearY === "limited") {
        const linearLimit = new PxJointLinearLimitPair(
            linearLimitYLow * CM2M,
            linearLimitYHigh * CM2M
        )
        linearLimit.stiffness = linearStiffnessY
        linearLimit.damping = linearDampingY
        pxJoint.setLinearLimit(PxD6AxisEnum.eY(), linearLimit)
        destroy(linearLimit)
    }
    if (linearZ === "limited") {
        const linearLimit = new PxJointLinearLimitPair(
            linearLimitZLow * CM2M,
            linearLimitZHigh * CM2M
        )
        linearLimit.stiffness = linearStiffnessZ
        linearLimit.damping = linearDampingZ
        pxJoint.setLinearLimit(PxD6AxisEnum.eZ(), linearLimit)
        destroy(linearLimit)
    }

    pxJoint.setMotion(PxD6AxisEnum.eSWING1(), getMotion(swingY))
    pxJoint.setMotion(PxD6AxisEnum.eSWING2(), getMotion(swingZ))
    pxJoint.setMotion(PxD6AxisEnum.eTWIST(), getMotion(twistX))

    if (swingY === "limited" || swingZ === "limited") {
        const limitCone = new PxJointLimitCone(
            swingLimitY * deg2Rad,
            swingLimitZ * deg2Rad
        )
        limitCone.stiffness = swingStiffness
        limitCone.damping = swingDamping
        pxJoint.setSwingLimit(limitCone)
        destroy(limitCone)
    }
    if (twistX === "limited") {
        const limitPair = new PxJointAngularLimitPair(
            twistLimitLow * deg2Rad,
            twistLimitHigh * deg2Rad
        )
        limitPair.stiffness = twistStiffness
        limitPair.damping = twistDamping
        pxJoint.setTwistLimit(limitPair)
        destroy(limitPair)
    }
})

export default class D6Joint extends JointBase implements ID6Joint {
    public static componentName = "d6Joint"
    public static defaults = d6JointDefaults
    public static schema = d6JointSchema

    protected createJoint(
        fromPxTransform: any,
        toPxTransform: any,
        fromManager: PhysicsObjectManager,
        toManager: PhysicsObjectManager
    ) {
        configJointSystem(this)
        return createD6(
            fromManager.actor,
            fromPxTransform,
            toManager.actor,
            toPxTransform
        )
    }

    private _linearX?: D6MotionOptions
    public get linearX() {
        return this._linearX ?? "locked"
    }
    public set linearX(val) {
        this._linearX = val
        configJointSystem(this)
    }

    private _linearLimitXLow?: number
    public get linearLimitXLow() {
        return this._linearLimitXLow ?? -100
    }
    public set linearLimitXLow(val) {
        this._linearLimitXLow = val
        configJointSystem(this)
    }

    private _linearLimitXHigh?: number
    public get linearLimitXHigh() {
        return this._linearLimitXHigh ?? 100
    }
    public set linearLimitXHigh(val) {
        this._linearLimitXHigh = val
        configJointSystem(this)
    }

    private _linearStiffnessX?: number
    public get linearStiffnessX() {
        return this._linearStiffnessX ?? 0
    }
    public set linearStiffnessX(val) {
        this._linearStiffnessX = val
        configJointSystem(this)
    }

    private _linearDampingX?: number
    public get linearDampingX() {
        return this._linearDampingX ?? 0
    }
    public set linearDampingX(val) {
        this._linearDampingX = val
        configJointSystem(this)
    }

    private _linearY?: D6MotionOptions
    public get linearY() {
        return this._linearY ?? "locked"
    }
    public set linearY(val) {
        this._linearY = val
        configJointSystem(this)
    }

    private _linearLimitYLow?: number
    public get linearLimitYLow() {
        return this._linearLimitYLow ?? -100
    }
    public set linearLimitYLow(val) {
        this._linearLimitYLow = val
        configJointSystem(this)
    }

    private _linearLimitYHigh?: number
    public get linearLimitYHigh() {
        return this._linearLimitYHigh ?? 100
    }
    public set linearLimitYHigh(val) {
        this._linearLimitYHigh = val
        configJointSystem(this)
    }

    private _linearStiffnessY?: number
    public get linearStiffnessY() {
        return this._linearStiffnessY ?? 0
    }
    public set linearStiffnessY(val) {
        this._linearStiffnessY = val
        configJointSystem(this)
    }

    private _linearDampingY?: number
    public get linearDampingY() {
        return this._linearDampingY ?? 0
    }
    public set linearDampingY(val) {
        this._linearDampingY = val
        configJointSystem(this)
    }

    private _linearZ?: D6MotionOptions
    public get linearZ() {
        return this._linearZ ?? "locked"
    }
    public set linearZ(val) {
        this._linearZ = val
        configJointSystem(this)
    }

    private _linearLimitZLow?: number
    public get linearLimitZLow() {
        return this._linearLimitZLow ?? -100
    }
    public set linearLimitZLow(val) {
        this._linearLimitZLow = val
        configJointSystem(this)
    }

    private _linearLimitZHigh?: number
    public get linearLimitZHigh() {
        return this._linearLimitZHigh ?? 100
    }
    public set linearLimitZHigh(val) {
        this._linearLimitZHigh = val
        configJointSystem(this)
    }

    private _linearStiffnessZ?: number
    public get linearStiffnessZ() {
        return this._linearStiffnessZ ?? 0
    }
    public set linearStiffnessZ(val) {
        this._linearStiffnessZ = val
        configJointSystem(this)
    }

    private _linearDampingZ?: number
    public get linearDampingZ() {
        return this._linearDampingZ ?? 0
    }
    public set linearDampingZ(val) {
        this._linearDampingZ = val
        configJointSystem(this)
    }

    private _twistX?: D6MotionOptions
    public get twistX() {
        return this._twistX ?? "locked"
    }
    public set twistX(val) {
        this._twistX = val
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

    private _twistStiffness?: number
    public get twistStiffness() {
        return this._twistStiffness ?? 0
    }
    public set twistStiffness(val) {
        this._twistStiffness = val
        configJointSystem(this)
    }

    private _twistDamping?: number
    public get twistDamping() {
        return this._twistDamping ?? 0
    }
    public set twistDamping(val) {
        this._twistDamping = val
        configJointSystem(this)
    }

    private _swingY?: D6MotionOptions
    public get swingY() {
        return this._swingY ?? "locked"
    }
    public set swingY(val) {
        this._swingY = val
        configJointSystem(this)
    }

    private _swingZ?: D6MotionOptions
    public get swingZ() {
        return this._swingZ ?? "locked"
    }
    public set swingZ(val) {
        this._swingZ = val
        configJointSystem(this)
    }

    private _swingStiffness?: number
    public get swingStiffness() {
        return this._swingStiffness ?? 0
    }
    public set swingStiffness(val) {
        this._swingStiffness = val
        configJointSystem(this)
    }

    private _swingDamping?: number
    public get swingDamping() {
        return this._swingDamping ?? 0
    }
    public set swingDamping(val) {
        this._swingDamping = val
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
