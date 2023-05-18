import JointBase from "../../display/core/JointBase"
import PhysicsObjectManager from "../../display/core/PhysicsObjectManager"
import { onTransformEdit } from "../../events/onTransformEdit"
import { addConfigJointSystem } from "../configSystems/configJointSystem"
import eventSimpleSystemWithData from "../utils/eventSimpleSystemWithData"

export const [
    addJointTargetTransformEditSystem,
    deleteJointTargetTransformSystem
] = eventSimpleSystemWithData(
    (
        self: JointBase,
        data: {
            fromManager: PhysicsObjectManager
            toManager: PhysicsObjectManager
        },
        { target, phase }
    ) => {
        phase === "end" &&
            (target === self ||
                target === data.fromManager ||
                target === data.toManager) &&
            addConfigJointSystem(self)
    },
    onTransformEdit
)
