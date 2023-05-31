import PointLight from "../display/lights/PointLight"
import { getDistanceFromCamera } from "../memo/getDistanceFromCamera"
import { lightIncrementPtr } from "../pointers/lightIncrementPtr"
import {
    releaseShadowRenderTarget,
    requestShadowRenderTarget
} from "../pools/objectPools/shadowRenderTargetPool"
import updateShadow from "../display/utils/updateShadow"
import { shadowModePtr } from "../pointers/shadowModePtr"
import createSystem from "./utils/createInternalSystem"

const resolutions = [256, 256, 128, 32, 16, 512]
const biases = [-0.02, -0.02, -0.03, -0.04, -0.05, -0.005]

export const pointLightShadowResolutionSystem = createSystem(
    "pointLightShadowResolutionSystem",
    {
        data: { step: undefined as number | undefined },
        update: (self: PointLight, data) => {
            if (!self.object3d.intensity || !shadowModePtr[0]) return

            const distance = getDistanceFromCamera(self)
            let step = 4
            if (self.distance > 3000) step = 5
            else {
                if (distance < lightIncrementPtr[0]) step = 0
                else if (distance < lightIncrementPtr[1]) step = 1
                else if (distance < lightIncrementPtr[2]) step = 2
                else if (distance < lightIncrementPtr[3]) step = 3
            }
            if (step === data.step) return
            data.step = step

            const { shadow } = self.object3d
            const extents = shadow.getFrameExtents()
            const res = resolutions[step]
            shadow.mapSize.setScalar(res)
            shadow.bias = biases[step]
            releaseShadowRenderTarget(shadow.map)
            shadow.map = requestShadowRenderTarget([
                res * extents.x,
                res * extents.y
            ])
            updateShadow(shadow)
        }
    }
)
