import CharacterCamera from "../display/core/CharacterCamera"
import getWorldPosition from "../memo/getWorldPosition"
import getWorldQuaternion from "../memo/getWorldQuaternion"
import createInternalSystem from "./utils/createInternalSystem"

export const characterCameraSystem = createInternalSystem("characterCameraSystem", {
    update: (self: CharacterCamera) => {
        self.$camera.position.copy(getWorldPosition(self.$innerObject))
        self.$camera.quaternion.copy(getWorldQuaternion(self.$innerObject))
    }
})
