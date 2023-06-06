import CharacterCamera from "../../display/core/CharacterCamera"
import { onTransformEdit } from "../../events/onTransformEdit"
import { LockTargetRotationValue } from "../../interface/ICharacterCamera"
import getContext from "../../memo/getContext"
import eventSystem from "../utils/eventSystem"

export const characterCameraTransformEditSystem = eventSystem(
    "characterCameraTransformEditSystem",
    (self: CharacterCamera, { target, phase, mode }) => {
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
    onTransformEdit
)
