import { physxPtr } from "../../pointers/physxPtr"
import RevoluteJoint from "../../display/joints/RevoluteJoint"
import createInternalSystem from "../utils/createInternalSystem"
import { DEG2RAD } from "three/src/math/MathUtils"

export const configRevoluteJointSystem = createInternalSystem(
    "configRevoluteJointSystem",
    {
        effect: (self: RevoluteJoint) => {
            const {
                $pxJoint,
                limited,
                limitLow,
                limitHigh,
                stiffness,
                damping,
                driveVelocity
            } = self
            if (!$pxJoint) return

            const {
                PxJointAngularLimitPair,
                PxRevoluteJointFlagEnum,
                destroy
            } = physxPtr[0]

            if (limited) {
                const limitPair = new PxJointAngularLimitPair(
                    limitLow * DEG2RAD,
                    limitHigh * DEG2RAD
                )
                limitPair.stiffness = stiffness
                limitPair.damping = damping
                $pxJoint.setLimit(limitPair)
                destroy(limitPair)
            }
            $pxJoint.setRevoluteJointFlag(
                PxRevoluteJointFlagEnum.eLIMIT_ENABLED(),
                limited
            )
            $pxJoint.setDriveVelocity(driveVelocity)
            $pxJoint.setRevoluteJointFlag(
                PxRevoluteJointFlagEnum.eDRIVE_ENABLED(),
                driveVelocity > 0
            )
        }
    }
)
