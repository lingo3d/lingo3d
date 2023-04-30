import renderSystemWithData from "./utils/renderSystemWithData"
import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../utilsCached/getIntensityFactor"
import {
    releasePointLight,
    requestPointLight
} from "../pools/objectPools/pointLightPool"
import scene from "../engine/scene"

export const [addPooledPointLightSystem] = renderSystemWithData(
    (self: PooledPointLight, data: { visible: boolean }) => {
        const intensityFactor = getIntensityFactor(self)
        const visible = !!intensityFactor
        if (visible && !data.visible) {
            const light = (self.$light = requestPointLight([], ""))
            self.object3d.add(light.outerObject3d)
            light.distance = self.distance
            light.intensity = self.intensity
            light.color = self.color
            light.shadows = self.shadows
        } else if (!visible && data.visible) {
            releasePointLight(self.$light)
            scene.add(self.$light!.outerObject3d)
            self.$light = undefined
        }
        data.visible = visible
    }
)
