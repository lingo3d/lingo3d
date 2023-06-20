import CharacterCamera from "../../display/core/CharacterCamera"
import { onTransformEdit } from "../../events/onTransformEdit"
import { LockTargetRotationValue } from "../../interface/ICharacterCamera"
import getContext from "../../memo/getContext"
import createInternalSystem from "../utils/createInternalSystem"

export const characterCameraTransformEditSystem = createInternalSystem(
    "characterCameraTransformEditSystem",
    {
        update: (self: CharacterCamera, _, { target, phase, mode }) => {
            if (mode !== "rotate" || self !== target) return

            const context = getContext(self) as {
                lockTargetRotation: LockTargetRotationValue
            }
            if (phase === "start") {
                context.lockTargetRotation = self.lockTargetRotation
                self.lockTargetRotation = "follow"
                return
            }
            self.lockTargetRotation = context.lockTargetRotation
        },
        updateTicker: onTransformEdit
    }
)
