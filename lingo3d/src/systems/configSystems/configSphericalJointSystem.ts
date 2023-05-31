import { deg2Rad } from "@lincode/math"
import { physxPtr } from "../../pointers/physxPtr"
import SphericalJoint from "../../display/joints/SphericalJoint"
import createSystem from "../utils/createInternalSystem"

export const configSphericalJointSystem = createSystem(
    "configSphericalJointSystem",
    {
        effect: (self: SphericalJoint) => {
            const { $pxJoint, limited, limitY, limitZ } = self
            if (!$pxJoint) return

            const { PxJointLimitCone, PxSphericalJointFlagEnum, destroy } =
                physxPtr[0]
            if (limited) {
                const cone = new PxJointLimitCone(
                    limitY * deg2Rad,
                    limitZ * deg2Rad,
                    0.05
                )
                $pxJoint.setLimitCone(cone)
                destroy(cone)
            }
            $pxJoint.setSphericalJointFlag(
                PxSphericalJointFlagEnum.eLIMIT_ENABLED(),
                limited
            )
        }
    }
)
