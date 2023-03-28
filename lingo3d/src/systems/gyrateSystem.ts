import OrbitCamera from "../display/cameras/OrbitCamera"
import renderSystemWithData from "../utils/renderSystemWithData"

export const [addGyrateSystem, deleteGyrateSystem] = renderSystemWithData(
    (cam: OrbitCamera, data: { speed: number }) =>
        cam.gyrate(data.speed, 0, true)
)
