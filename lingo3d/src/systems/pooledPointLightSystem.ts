import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import {
    releasePointLight,
    requestPointLight
} from "../pools/objectPools/pointLightPool"
import scene from "../engine/scene"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"
import { clearNumberPtrSystem } from "./clearNumberPtrSystem"
import createSystem from "./utils/createSystem"

const countPtr = [0]
clearNumberPtrSystem.add(countPtr)

export const pooledPointLightSystem = createSystem({
    data: { visible: false },
    update: (self: PooledPointLight, data) => {
        const intensityFactor = getIntensityFactor(self)
        const visible =
            !!intensityFactor && ++countPtr[0] <= pointLightPoolPtr[0]
        if (visible && !data.visible) {
            const light = (self.$light = requestPointLight([], ""))
            self.object3d.add(light.outerObject3d)
            light.distance = self.distance
            light.intensity = self.intensity
            light.color = self.color
            light.shadows = self.shadows
            light.fade = self.fade
        } else if (!visible && data.visible) {
            const light = self.$light!
            releasePointLight(light)
            scene.add(light.outerObject3d)
            light.intensity = 0
            self.$light = undefined
        }
        data.visible = visible
    },
    sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
})
