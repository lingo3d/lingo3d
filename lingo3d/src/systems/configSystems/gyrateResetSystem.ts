import CameraBase from "../../display/core/CameraBase"
import { gyrateInertiaSystem } from "../gyrateInertiaSystem"
import configSystem from "../utils/configSystem"

export const [addGyrateResetSystem] = configSystem((self: CameraBase) => {
    self.gyrate(0, 0)
    gyrateInertiaSystem.delete(self)
})
