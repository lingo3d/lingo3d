import { physxPtr } from "../../pointers/physxPtr"
import SphericalJoint from "../../display/joints/SphericalJoint"
import createInternalSystem from "../utils/createInternalSystem"
import { DEG2RAD } from "three/src/math/MathUtils"

export const configSphericalJointSystem = createInternalSystem(
    "configSphericalJointSystem",
    {
        effect: (self: SphericalJoint) => {
            const { $pxJoint, limited, limitY, limitZ } = self
            if (!$pxJoint) return

            const { PxJointLimitCone, PxSphericalJointFlagEnum, destroy } =
                physxPtr[0]
            if (limited) {
                const cone = new PxJointLimitCone(
                    limitY * DEG2RAD,
                    limitZ * DEG2RAD,
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
