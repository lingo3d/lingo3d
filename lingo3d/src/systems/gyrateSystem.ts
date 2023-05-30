import OrbitCamera from "../display/cameras/OrbitCamera"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import createSystem from "./utils/createSystem"

export const gyrateSystem = createSystem({
    update: (self: OrbitCamera) =>
        self.$camera === cameraRenderedPtr[0] &&
        self.gyrate(self.autoRotateSpeed, 0)
})
