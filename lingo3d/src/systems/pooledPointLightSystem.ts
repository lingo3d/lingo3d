import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import {
    releasePointLight,
    requestPointLight
} from "../pools/objectPools/pointLightPool"
import scene from "../engine/scene"
import sortedRenderSystemWithData from "./utils/sortedRenderSystemWithData"
import { pointLightPoolPtr } from "../pointers/pointLightPoolPtr"
import { clearNumberPtrSystem } from "./clearNumberPtrSystem"

const countPtr = [0]
clearNumberPtrSystem.add(countPtr)

export const [addPooledPointLightSystem] = sortedRenderSystemWithData(
    (self: PooledPointLight, data: { visible: boolean }) => {
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
    (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
)
