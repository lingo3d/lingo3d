import { mapRange } from "@lincode/math"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import renderSystem from "./utils/renderSystem"
import AreaLight from "../display/lights/AreaLight"
import { lightDistancePtr } from "../pointers/lightDistancePtr"

export const [addAreaLightIntensitySystem, deleteAreaLightIntensitySystem] =
    renderSystem((self: AreaLight) => {
        const distance = getDistanceFromCamera(self)
        self._intensityFactor = mapRange(
            distance,
            0,
            lightDistancePtr[0],
            1,
            0,
            true
        )
        self._enabledFactor = !!self._intensityFactor
        if (!self.light) return
        self.light.intensity = self.intensity * self._intensityFactor
        self.light.visible = !!(
            (self.enabled as any) * (self._enabledFactor as any)
        )
    })
