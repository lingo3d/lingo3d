import getIntensityFactor from "../memo/getIntensityFactor"
import PointLightBase from "../display/core/PointLightBase"
import gameSystem from "./utils/gameSystem"

export const lightIntensitySystem = gameSystem({
    update: (self: PointLightBase) => {
        self.object3d.intensity = self.intensity * getIntensityFactor(self)
        // self.object3d.visible = !!intensityFactor
    }
})
