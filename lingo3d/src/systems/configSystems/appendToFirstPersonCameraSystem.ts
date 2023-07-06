import FirstPersonCamera from "../../display/cameras/FirstPersonCamera"
import MeshAppendable from "../../display/core/MeshAppendable"
import getActualScale from "../../memo/getActualScale"
import createInternalSystem from "../utils/createInternalSystem"

export const appendToFirstPersonCameraSystem = createInternalSystem(
    "appendToFirstPersonCameraSystem",
    {
        effect: (self: FirstPersonCamera) => {
            const [found] = self.children ?? []
            if (!(found instanceof MeshAppendable) || self.$innerYSet)
                return false
            self.$superInnerY(getActualScale(found).y * 0.4)
        },
        cleanup: (self) => {
            self.$superInnerY(0)
        }
    }
)
