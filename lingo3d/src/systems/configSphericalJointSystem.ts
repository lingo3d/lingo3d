import { deg2Rad } from "@lincode/math"
import destroy from "../display/core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../display/core/PhysicsObjectManager/physx/physxPtr"
import SphericalJoint from "../display/joints/SphericalJoint"
import renderSystemAutoClear from "./utils/renderSystemAutoClear"

export const [addConfigSphericalJointSystem] = renderSystemAutoClear(
    (target: SphericalJoint) => {
        const { pxJoint, limited, limitY, limitZ } = target
        if (!pxJoint) return

        const { PxJointLimitCone, PxSphericalJointFlagEnum } = physxPtr[0]
        if (limited) {
            const cone = new PxJointLimitCone(
                limitY * deg2Rad,
                limitZ * deg2Rad,
                0.05
            )
            pxJoint.setLimitCone(cone)
            destroy(cone)
        }
        pxJoint.setSphericalJointFlag(
            PxSphericalJointFlagEnum.eLIMIT_ENABLED(),
            limited
        )
    }
)
