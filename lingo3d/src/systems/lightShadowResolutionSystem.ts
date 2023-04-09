import PointLight from "../display/lights/PointLight"
import renderSystemWithData from "./utils/renderSystemWithData"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import SpotLight from "../display/lights/SpotLight"

const resolutions = [512, 256, 128, 32, 16, 512]
const biases = [-0.01, -0.02, -0.03, -0.04, -0.05, -0.005]

export const [
    addLightShadowResolutionSystem,
    deleteLightShadowResolutionSystem
] = renderSystemWithData(
    (self: PointLight | SpotLight, data: { step: number | undefined }) => {
        const distance = getDistanceFromCamera(self)
        let step = 4
        if (self.distance > 3000) step = 5
        else {
            if (distance < 10) step = 0
            else if (distance < 20) step = 1
            else if (distance < 30) step = 2
            else if (distance < 40) step = 3
        }
        if (step === data.step) return
        data.step = step

        const { light } = self
        const { shadow } = light
        shadow.map?.dispose()
        shadow.mapSize.setScalar(resolutions[step])
        shadow.bias = biases[step]
        //@ts-ignore
        shadow.map = null
    }
)
