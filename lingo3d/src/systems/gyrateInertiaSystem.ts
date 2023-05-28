import CameraBase from "../display/core/CameraBase"
import gameSystem from "./utils/gameSystem"

export const gyrateInertiaSystem = gameSystem({
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
