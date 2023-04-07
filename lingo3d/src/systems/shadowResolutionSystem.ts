import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"
import getWorldPosition from "../display/utils/getWorldPosition"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import renderSystemWithData from "./utils/renderSystemWithData"

const resolutions = [512, 256, 128, 32, 16]
const biases = [-0.01, -0.02, -0.03, -0.04, -0.05]

export const [addShadowResolutionSystem, deleteShadowResolutionSystem] =
    renderSystemWithData(
        (self: PointLight | SpotLight, data: { step: number | undefined }) => {
            const camera = cameraRenderedPtr[0]
            const distance = getWorldPosition(self.outerObject3d).distanceTo(
                getWorldPosition(camera)
            )
            let step = 4
            if (distance < 10) step = 0
            else if (distance < 20) step = 1
            else if (distance < 30) step = 2
            else if (distance < 40) step = 3

            if (step === data.step) return
            data.step = step

            const { light } = self
            const { shadow } = light
            shadow.map?.dispose()
            shadow.mapSize.setScalar(resolutions[step])
            shadow.bias = biases[step] * self.shadowBiasCoeff
            //@ts-ignore
            shadow.map = null
        }
    )
