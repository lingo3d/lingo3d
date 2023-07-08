import { getDistanceFromCamera } from "../memo/getDistanceFromCamera"
import SpotLight from "../display/lights/SpotLight"
import { lightIncrementPtr } from "../pointers/lightIncrementPtr"
import { shadowRenderTargetPool } from "../pools/objectPools/shadowRenderTargetPool"
import updateShadow from "../display/utils/updateShadow"
import createInternalSystem from "./utils/createInternalSystem"

const resolutions = [1024, 512, 256, 128]
const biases = [-0.006, -0.005, -0.004, -0.003]

export const spotLightShadowResolutionSystem = createInternalSystem(
    "spotLightShadowResolutionSystem",
    {
        data: { step: undefined as number | undefined },
        update: (self: SpotLight, data) => {
            if (!self.$innerObject.intensity) return

            const distance = getDistanceFromCamera(self)
            let step = 3
            if (distance < lightIncrementPtr[0]) step = 0
            else if (distance < lightIncrementPtr[1]) step = 1
            else if (distance < lightIncrementPtr[2]) step = 2

            if (step === data.step) return
            data.step = step

            const { shadow } = self.$innerObject
            const res = resolutions[step]
            shadow.mapSize.setScalar(res)
            shadow.bias = biases[step]
            shadowRenderTargetPool.release(shadow.map)
            shadow.map = shadowRenderTargetPool.request([res, res])
            updateShadow(shadow)
        }
    }
)
