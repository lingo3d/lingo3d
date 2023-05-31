import CameraBase from "../../display/core/CameraBase"
import createSystem from "../utils/createSystem"

export const configCameraSystem = createSystem("configCameraSystem", {
    effect: (self: CameraBase) => {
        const { $camera } = self
        $camera.fov = self.fov
        $camera.zoom = self.zoom
        $camera.updateProjectionMatrix()
    }
})
