import CameraBase from "../../display/core/CameraBase"
import { gyrateInertiaSystem } from "../gyrateInertiaSystem"
import createSystem from "../utils/createInternalSystem"

export const gyrateResetSystem = createSystem("gyrateResetSystem", {
    effect: (self: CameraBase) => {
        self.gyrate(0, 0)
        gyrateInertiaSystem.delete(self)
    }
})
