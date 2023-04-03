import { physxPtr } from "../../pointers/physxPtr"
import PrismaticJoint from "../../display/joints/PrismaticJoint"
import { CM2M } from "../../globals"
import configSystem from "../utils/configSystem"

export const [addConfigPrismaticJointSystem] = configSystem(
    (target: PrismaticJoint) => {
        const { pxJoint, limited, limitLow, limitHigh, stiffness, damping } =
            target
        if (!pxJoint) return

        const { PxJointLinearLimitPair, PxPrismaticJointFlagEnum, destroy } =
            physxPtr[0]

        if (limited) {
            const linearLimit = new PxJointLinearLimitPair(
                limitLow * CM2M,
                limitHigh * CM2M
            )
            linearLimit.stiffness = stiffness
            linearLimit.damping = damping
            pxJoint.setLimit(linearLimit)
            destroy(linearLimit)
        }
        pxJoint.setPrismaticJointFlag(
            PxPrismaticJointFlagEnum.eLIMIT_ENABLED(),
            limited
        )
    }
)
