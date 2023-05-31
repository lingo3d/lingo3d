import { deg2Rad } from "@lincode/math"
import { assertExhaustive } from "@lincode/utils"
import { physxPtr } from "../../pointers/physxPtr"
import D6Joint from "../../display/joints/D6Joint"
import { CM2M } from "../../globals"
import { D6MotionOptions } from "../../interface/ID6Joint"
import createSystem from "../utils/createInternalSystem"

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

export const configD6JointSystem = createSystem("configD6JointSystem", {
    effect: (self: D6Joint) => {
        const { $pxJoint } = self
        if (!$pxJoint) return

        const {
            PxD6AxisEnum,
            PxJointLimitCone,
            PxJointAngularLimitPair,
            PxJointLinearLimitPair,
            destroy
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
        } = self

        $pxJoint.setMotion(PxD6AxisEnum.eX(), getMotion(linearX))
        $pxJoint.setMotion(PxD6AxisEnum.eY(), getMotion(linearY))
        $pxJoint.setMotion(PxD6AxisEnum.eZ(), getMotion(linearZ))

        if (linearX === "limited") {
            const linearLimit = new PxJointLinearLimitPair(
                linearLimitXLow * CM2M,
                linearLimitXHigh * CM2M
            )
            linearLimit.stiffness = linearStiffnessX
            linearLimit.damping = linearDampingX
            $pxJoint.setLinearLimit(PxD6AxisEnum.eX(), linearLimit)
            destroy(linearLimit)
        }
        if (linearY === "limited") {
            const linearLimit = new PxJointLinearLimitPair(
                linearLimitYLow * CM2M,
                linearLimitYHigh * CM2M
            )
            linearLimit.stiffness = linearStiffnessY
            linearLimit.damping = linearDampingY
            $pxJoint.setLinearLimit(PxD6AxisEnum.eY(), linearLimit)
            destroy(linearLimit)
        }
        if (linearZ === "limited") {
            const linearLimit = new PxJointLinearLimitPair(
                linearLimitZLow * CM2M,
                linearLimitZHigh * CM2M
            )
            linearLimit.stiffness = linearStiffnessZ
            linearLimit.damping = linearDampingZ
            $pxJoint.setLinearLimit(PxD6AxisEnum.eZ(), linearLimit)
            destroy(linearLimit)
        }

        $pxJoint.setMotion(PxD6AxisEnum.eSWING1(), getMotion(swingY))
        $pxJoint.setMotion(PxD6AxisEnum.eSWING2(), getMotion(swingZ))
        $pxJoint.setMotion(PxD6AxisEnum.eTWIST(), getMotion(twistX))

        if (swingY === "limited" || swingZ === "limited") {
            const limitCone = new PxJointLimitCone(
                swingLimitY * deg2Rad,
                swingLimitZ * deg2Rad
            )
            limitCone.stiffness = swingStiffness
            limitCone.damping = swingDamping
            $pxJoint.setSwingLimit(limitCone)
            destroy(limitCone)
        }
        if (twistX === "limited") {
            const limitPair = new PxJointAngularLimitPair(
                twistLimitLow * deg2Rad,
                twistLimitHigh * deg2Rad
            )
            limitPair.stiffness = twistStiffness
            limitPair.damping = twistDamping
            $pxJoint.setTwistLimit(limitPair)
            destroy(limitPair)
        }
    }
})
