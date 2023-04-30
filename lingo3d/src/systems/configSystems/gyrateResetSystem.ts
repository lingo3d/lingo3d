import CameraBase from "../../display/core/CameraBase"
import { deleteGyrateInertiaSystem } from "../gyrateInertiaSystem"
import configSystem from "../utils/configSystem"

export const [addGyrateResetSystem] = configSystem((self: CameraBase) => {
    self.gyrate(0, 0)
    deleteGyrateInertiaSystem(self)
})
