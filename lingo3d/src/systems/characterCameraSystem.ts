import CharacterCamera from "../display/core/CharacterCamera"
import getWorldPosition from "../utilsCached/getWorldPosition"
import getWorldQuaternion from "../utilsCached/getWorldQuaternion"
import renderSystem from "./utils/renderSystem"

export const [addCharacterCameraSystem, deleteCharacterCameraSystem] =
    renderSystem((self: CharacterCamera) => {
        self.$camera.position.copy(getWorldPosition(self.object3d))
        self.$camera.quaternion.copy(getWorldQuaternion(self.object3d))
    })
