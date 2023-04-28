import PointLight from "../display/lights/PointLight"
import renderSystemWithData from "./utils/renderSystemWithData"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import { lightIncrementPtr } from "../pointers/lightIncrementPtr"
import {
    releaseShadowRenderTarget,
    requestShadowRenderTarget
} from "../pools/objectPools/shadowRenderTargetPool"

const resolutions = [512, 256, 128, 32, 16, 512]
const biases = [-0.01, -0.02, -0.03, -0.04, -0.05, -0.005]

export const [
    addPointLightShadowResolutionSystem,
    deletePointLightShadowResolutionSystem
] = renderSystemWithData(
    (self: PointLight, data: { step: number | undefined }) => {
        if (!self.object3d.visible) return

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
        shadow.needsUpdate = true
    }
)
