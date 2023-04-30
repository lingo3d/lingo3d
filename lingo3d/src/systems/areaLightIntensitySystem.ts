import { mapRange } from "@lincode/math"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import renderSystem from "./utils/renderSystem"
import AreaLight from "../display/lights/AreaLight"
import { lightDistancePtr } from "../pointers/lightDistancePtr"

export const [addAreaLightIntensitySystem] = renderSystem((self: AreaLight) => {
    if (!self.$light) return
    const intensityFactor = mapRange(
        getDistanceFromCamera(self),
        0,
        lightDistancePtr[0],
        1,
        0,
        true
    )
    self.$light.intensity = self.intensity * intensityFactor
    // self.light.visible = !!intensityFactor
})
