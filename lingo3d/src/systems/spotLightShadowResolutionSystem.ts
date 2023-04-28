import renderSystemWithData from "./utils/renderSystemWithData"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import SpotLight from "../display/lights/SpotLight"
import { lightIncrementPtr } from "../pointers/lightIncrementPtr"
import {
    releaseShadowRenderTarget,
    requestShadowRenderTarget
} from "../pools/objectPools/shadowRenderTargetPool"
import updateShadow from "../display/utils/updateShadow"
import { shadowModePtr } from "../pointers/shadowModePtr"

const resolutions = [1024, 512, 256, 128]
const biases = [-0.006, -0.005, -0.004, -0.003]

export const [
    addSpotLightShadowResolutionSystem,
    deleteSpotLightShadowResolutionSystem
] = renderSystemWithData(
    (self: SpotLight, data: { step: number | undefined }) => {
        if (!self.object3d.visible || !shadowModePtr[0]) return

        const distance = getDistanceFromCamera(self)
        let step = 3
        if (distance < lightIncrementPtr[0]) step = 0
        else if (distance < lightIncrementPtr[1]) step = 1
        else if (distance < lightIncrementPtr[2]) step = 2

        if (step === data.step) return
        data.step = step

        const { shadow } = self.object3d
        const res = resolutions[step]
        shadow.mapSize.setScalar(res)
        shadow.bias = biases[step]
        releaseShadowRenderTarget(shadow.map)
        shadow.map = requestShadowRenderTarget([res, res])
        updateShadow(shadow)
    }
)
