import CharacterCamera from "../display/core/CharacterCamera"
import getWorldPosition from "../memo/getWorldPosition"
import getWorldQuaternion from "../memo/getWorldQuaternion"
import createSystem from "./utils/createSystem"

export const characterCameraSystem = createSystem({
    update: (self: CharacterCamera) => {
        self.$camera.position.copy(getWorldPosition(self.object3d))
        self.$camera.quaternion.copy(getWorldQuaternion(self.object3d))
    }
})
