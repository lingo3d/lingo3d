import renderSystemWithData from "./utils/renderSystemWithData"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import SpotLight from "../display/lights/SpotLight"

const resolutions = [1024, 512, 256, 128]
const biases = [-0.006, -0.005, -0.004, -0.003]

export const [
    addSpotLightShadowResolutionSystem,
    deleteSpotLightShadowResolutionSystem
] = renderSystemWithData(
    (self: SpotLight, data: { step: number | undefined }) => {
        const distance = getDistanceFromCamera(self)
        let step = 3
        if (distance < 10) step = 0
        else if (distance < 20) step = 1
        else if (distance < 30) step = 2

        if (step === data.step) return
        data.step = step

        const { $light: light } = self
        const { shadow } = light
        shadow.map?.dispose()
        shadow.mapSize.setScalar(resolutions[step])
        shadow.bias = biases[step]
        //@ts-ignore
        shadow.map = null
    }
)
