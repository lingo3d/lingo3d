import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import {
    releasePointLight,
    requestPointLight
} from "../pools/objectPools/pointLightPool"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"
import getWorldPosition from "../memo/getWorldPosition"

let count = 0

export const pooledPointLightSystem = createInternalSystem(
    "pooledPointLightSystem",
    {
        data: { visible: false },
        afterTick: () => {
            count = 0
        },
        update: (self: PooledPointLight, data) => {
            const intensityFactor = getIntensityFactor(self)
            const visible = !!intensityFactor && ++count <= pointLightPoolPtr[0]
            if (visible && !data.visible) {
                const light = (self.$light = requestPointLight([], ""))
                light.distance = self.distance
                light.intensity = self.intensity
                light.color = self.color
                light.shadows = self.shadows
                light.fade = self.fade
            } else if (!visible && data.visible) {
                const light = self.$light!
                releasePointLight(light)
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
