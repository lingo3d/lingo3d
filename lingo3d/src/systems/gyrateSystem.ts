import OrbitCamera from "../display/cameras/OrbitCamera"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import gameSystem from "./utils/gameSystem"

export const gyrateSystem = gameSystem({
    update: (self: OrbitCamera) =>
        self.$camera === cameraRenderedPtr[0] &&
        self.gyrate(self.autoRotateSpeed, 0)
})
