import CameraBase from "../display/core/CameraBase"
import renderSystemWithData from "./utils/renderSystemWithData"

export const [addGyrateInertiaSystem, deleteGyrateInertiaSystem] =
    renderSystemWithData(
        (
            self: CameraBase,
            data: {
                factor: number
                movementX: number
                movementY: number
            }
        ) => {
            data.factor *= 0.95
            self.$gyrate(
                data.movementX * data.factor,
                data.movementY * data.factor
            )
            data.factor <= 0.001 && deleteGyrateInertiaSystem(self)
        }
    )
