import renderSystem from "./utils/renderSystem"
import getIntensityFactor from "../utilsCached/getIntensityFactor"
import PointLightBase from "../display/core/PointLightBase"

export const [addLightIntensitySystem, deleteLightIntensitySystem] =
    renderSystem((self: PointLightBase) => {
        self.object3d.intensity = self.intensity * getIntensityFactor(self)
        // self.object3d.visible = !!intensityFactor
    })
