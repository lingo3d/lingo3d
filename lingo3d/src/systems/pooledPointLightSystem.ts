import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import {
    releasePointLight,
    requestPointLight
} from "../pools/objectPools/pointLightPool"
import scene from "../engine/scene"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"
import createInternalSystem from "./utils/createInternalSystem"
import { configParentSystem } from "./configSystems/configParentSystem"

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
                configParentSystem.add(light.outerObject3d, {
                    parent: self.object3d
                })
                light.distance = self.distance
                light.intensity = self.intensity
                light.color = self.color
                light.shadows = self.shadows
                light.fade = self.fade
            } else if (!visible && data.visible) {
                const light = self.$light!
                releasePointLight(light)
                configParentSystem.add(light.outerObject3d, {
                    parent: scene
                })
                light.fade = false
                light.intensity = 0
                self.$light = undefined
            }
            data.visible = visible
        },
        sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
    }
)
