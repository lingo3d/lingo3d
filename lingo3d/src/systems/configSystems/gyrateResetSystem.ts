import CameraBase from "../../display/core/CameraBase"
import configSystem from "../utils/configSystem"

export const [addGyrateResetSystem] = configSystem((target: CameraBase) =>
    target.gyrate(0, 0)
)
