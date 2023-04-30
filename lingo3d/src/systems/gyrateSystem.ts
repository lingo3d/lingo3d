import OrbitCamera from "../display/cameras/OrbitCamera"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import renderSystem from "./utils/renderSystem"

export const [addGyrateSystem, deleteGyrateSystem] = renderSystem(
    (cam: OrbitCamera) =>
        cam.$camera === cameraRenderedPtr[0] &&
        cam.gyrate(cam.autoRotateSpeed, 0, false)
)
