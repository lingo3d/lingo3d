import { mapRange } from "@lincode/math"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import renderSystem from "./utils/renderSystem"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"

export const [addLightIntensitySystem, deleteLightIntensitySystem] =
    renderSystem((self: PointLight | SpotLight) => {
        const distance = getDistanceFromCamera(self)
        self._intensityFactor = mapRange(distance, 0, 50, 1, 0, true)
        self._enabledFactor = !!self._intensityFactor
        self.object3d.intensity = self.intensity * self._intensityFactor
        self.object3d.visible = !!(
            (self.enabled as any) * (self._enabledFactor as any)
        )
    })
