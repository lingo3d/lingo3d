import getIntensityFactor from "../memo/getIntensityFactor"
import PointLightBase from "../display/core/PointLightBase"
import createSystem from "./utils/createInternalSystem"

export const lightIntensitySystem = createSystem("lightIntensitySystem", {
    update: (self: PointLightBase) => {
        self.object3d.intensity = self.intensity * getIntensityFactor(self)
        // self.object3d.visible = !!intensityFactor
    }
})
