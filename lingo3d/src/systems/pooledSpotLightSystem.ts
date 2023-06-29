import PooledSpotLight from "../display/lights/PooledSpotLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import {
    releaseSpotLight,
    requestSpotLight
} from "../pools/objectPools/spotLightPool"
import { spotLightPoolPtr } from "../pointers/spotLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"
import getWorldPosition from "../memo/getWorldPosition"

let count = 0

export const pooledSpotLightSystem = createInternalSystem(
    "pooledSpotLightSystem",
    {
        data: { visible: false },
        afterTick: () => {
            count = 0
        },
        update: (self: PooledSpotLight, data) => {
            const intensityFactor = getIntensityFactor(self)
            const visible = !!intensityFactor && ++count <= spotLightPoolPtr[0]
            if (visible && !data.visible) {
                const light = (self.$light = requestSpotLight([], ""))
                light.distance = self.distance
                light.intensity = self.intensity
                light.color = self.color
                light.shadows = self.shadows
                light.fade = self.fade
                light.angle = self.angle
                light.penumbra = self.penumbra
                light.volumetric = self.volumetric
                light.volumetricDistance = self.volumetricDistance
            } else if (!visible && data.visible) {
                const light = self.$light!
                releaseSpotLight(light)
                light.fade = false
                light.intensity = 0
                self.$light = undefined
            }
            data.visible = visible
            visible &&
                self.$light!.position.copy(getWorldPosition(self.object3d))
        },
        sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
    }
)
