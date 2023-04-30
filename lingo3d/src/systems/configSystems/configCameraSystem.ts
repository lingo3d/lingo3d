import CameraBase from "../../display/core/CameraBase"
import configSystem from "../utils/configSystem"

export const [addConfigCameraSystem] = configSystem((self: CameraBase) => {
    const { $camera } = self
    $camera.fov = self.fov
    $camera.zoom = self.zoom
    $camera.updateProjectionMatrix()
})
