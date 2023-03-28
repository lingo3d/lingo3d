import CameraBase from "../display/core/CameraBase"
import renderSystemAutoClear from "../utils/renderSystemAutoClear"

export const [addGyrateResetSystem] = renderSystemAutoClear(
    (target: CameraBase) => target.gyrate(0, 0)
)
