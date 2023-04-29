import renderSystemWithData from "./utils/renderSystemWithData"
import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../utilsCached/getIntensityFactor"
import {
    releasePointLight,
    requestPointLight
} from "../pools/objectPools/pointLightPool"
import PointLight from "../display/lights/PointLight"

export const [addPooledPointLightSystem, deletePooledPointLightSystem] =
    renderSystemWithData(
        (
            self: PooledPointLight,
            data: { visible: boolean; light: PointLight | undefined }
        ) => {
            const intensityFactor = getIntensityFactor(self)
            const visible = !!intensityFactor
            if (visible && !data.visible) {
                const light = (data.light = requestPointLight([], ""))
                self.append(light)
                light.distance = self.distance
                light.intensity = self.intensity
                light.color = self.color
                light.shadows = self.shadows
            } else if (!visible && data.visible) {
                releasePointLight(data.light)
            }
            data.visible = visible
        }
    )
