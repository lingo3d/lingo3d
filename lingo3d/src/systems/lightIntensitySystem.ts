import { mapRange } from "@lincode/math"
import { CM2M } from "../globals"
import { getDistanceFromCamera } from "../utilsCached/getDistanceFromCamera"
import renderSystem from "./utils/renderSystem"
import PointLight from "../display/lights/PointLight"
import SpotLight from "../display/lights/SpotLight"

export const [addLightIntensitySystem, deleteLightIntensitySystem] =
    renderSystem((self: PointLight | SpotLight) => {
        const distance = getDistanceFromCamera(self)
        self.intensity = mapRange(
            distance - self.distance * CM2M,
            0,
            50,
            1,
            0,
            true
        )
        self.enabled = !!self.intensity
    })
