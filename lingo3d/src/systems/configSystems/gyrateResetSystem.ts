import CameraBase from "../../display/core/CameraBase"
import { gyrateInertiaSystem } from "../gyrateInertiaSystem"
import createSystem from "../utils/createSystem"

export const gyrateResetSystem = createSystem("gyrateResetSystem", {
    setup: (self: CameraBase) => {
        self.gyrate(0, 0)
        gyrateInertiaSystem.delete(self)
    }
})
