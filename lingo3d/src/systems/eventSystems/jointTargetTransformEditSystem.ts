import JointBase from "../../display/core/JointBase"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { onTransformEdit } from "../../events/onTransformEdit"
import { configJointSystemPtr } from "../../pointers/configJointSystemPtr"
import createInternalSystem from "../utils/createInternalSystem"

export const jointTargetTransformEditSystem = createInternalSystem(
    "jointTargetTransformEditSystem",
    {
        data: {} as {
            fromManager: PhysicsObjectManager
            toManager: PhysicsObjectManager
        },
        update: (self: JointBase, data, { target, phase }) => {
            phase === "end" &&
                (target === self ||
                    target === data.fromManager ||
                    target === data.toManager) &&
                configJointSystemPtr[0].add(self)
        },
        updateTicker: onTransformEdit
    }
)
