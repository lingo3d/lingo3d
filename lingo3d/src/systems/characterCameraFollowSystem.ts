import MeshAppendable from "../display/core/MeshAppendable"
import CharacterCamera from "../display/core/CharacterCamera"
import { euler, quaternion } from "../display/utils/reusables"
import { PI } from "../globals"
import { positionChangedXZ } from "../memo/positionChangedXZ"
import createInternalSystem from "./utils/createInternalSystem"
import { gyrateResetSystem } from "./configSystems/gyrateResetSystem"
import { frameSyncAlpha } from "../api/frameSync"

const followTargetRotation = (
    self: CharacterCamera,
    target: MeshAppendable,
    slerp: boolean
) => {
    euler.setFromQuaternion(target.quaternion)
    euler.y += PI

    if (slerp) {
        quaternion.setFromEuler(euler)
        self.$midObject3d.quaternion.slerp(quaternion, frameSyncAlpha(0.1))
    } else self.$midObject3d.setRotationFromEuler(euler)

    gyrateResetSystem.add(self)
}

const rotateTarget = (
    self: CharacterCamera,
    target: MeshAppendable,
    slerp: boolean
) => {
    euler.setFromQuaternion(self.$midObject3d.quaternion)
    euler.x = 0
    euler.z = 0
    euler.y += PI

    if (slerp) {
        quaternion.setFromEuler(euler)
        target.quaternion.slerp(quaternion, frameSyncAlpha(0.1))
        return
    }
    target.$object.setRotationFromEuler(euler)
}

export const characterCameraFollowSystem = createInternalSystem(
    "characterCameraFollowSystem",
    {
        data: {} as { found: MeshAppendable },
        update: (self: CharacterCamera, { found }) => {
            self.position.copy(found.position)

            if (!self.lockTargetRotation) return

            if (self.lockTargetRotation === "follow") {
                followTargetRotation(self, found, false)
                return
            }
            if (self.lockTargetRotation === "dynamic-lock") {
                positionChangedXZ(found.$object) &&
                    rotateTarget(self, found, true)
                return
            }
            if (self.lockTargetRotation === "dynamic-follow") {
                positionChangedXZ(found.$object) &&
                    followTargetRotation(self, found, true)
                return
            }
            rotateTarget(self, found, false)
        }
    }
)
