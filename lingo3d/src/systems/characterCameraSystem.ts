import CharacterCamera from "../display/core/CharacterCamera"
import getWorldPosition from "../memo/getWorldPosition"
import getWorldQuaternion from "../memo/getWorldQuaternion"
import gameSystem from "./utils/gameSystem"

export const characterCameraSystem = gameSystem({
    update: (self: CharacterCamera) => {
        self.$camera.position.copy(getWorldPosition(self.object3d))
        self.$camera.quaternion.copy(getWorldQuaternion(self.object3d))
    }
})
