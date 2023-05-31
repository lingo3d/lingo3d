import CameraBase from "../display/core/CameraBase"
import createSystem from "./utils/createSystem"

export const gyrateInertiaSystem = createSystem("gyrateInertiaSystem", {
    data: {} as {
        factor: number
        movementX: number
        movementY: number
    },
    update: (self: CameraBase, data) => {
        data.factor *= 0.95
        self.gyrate(data.movementX * data.factor, data.movementY * data.factor)
        data.factor <= 0.001 && gyrateInertiaSystem.delete(self)
    }
})
