import CameraBase from "../../display/core/CameraBase"
import createInternalSystem from "../utils/createInternalSystem"

export const configCameraSystem = createInternalSystem("configCameraSystem", {
    effect: (self: CameraBase) => {
        const { $camera } = self
        $camera.fov = self.fov
        $camera.zoom = self.zoom
        $camera.updateProjectionMatrix()
    }
})
