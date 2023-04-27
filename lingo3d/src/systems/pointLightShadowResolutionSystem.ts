import PointLight from "../display/lights/PointLight"
import renderSystemWithData from "./utils/renderSystemWithData"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import { addConfigCastShadowPhysicsSystem } from "./configSystems/configCastShadowPhysicsSystem"
import { lightIncrementPtr } from "../pointers/lightIncrementPtr"

const resolutions = [512, 256, 128, 32, 16, 512]
const biases = [-0.01, -0.02, -0.03, -0.04, -0.05, -0.005]

export const [
    addPointLightShadowResolutionSystem,
    deletePointLightShadowResolutionSystem
] = renderSystemWithData(
    (self: PointLight, data: { step: number | undefined }) => {
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
        shadow.map?.dispose()
        shadow.mapSize.setScalar(resolutions[step])
        shadow.bias = biases[step]
        //@ts-ignore
        shadow.map = null
        addConfigCastShadowPhysicsSystem(self)
    }
)
