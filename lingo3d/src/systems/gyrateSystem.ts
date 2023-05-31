import OrbitCamera from "../display/cameras/OrbitCamera"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import createInternalSystem from "./utils/createInternalSystem"

export const gyrateSystem = createInternalSystem("gyrateSystem", {
    update: (self: OrbitCamera) =>
        self.$camera === cameraRenderedPtr[0] &&
        self.gyrate(self.autoRotateSpeed, 0)
})
