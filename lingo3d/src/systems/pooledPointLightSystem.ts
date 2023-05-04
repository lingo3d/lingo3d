import PooledPointLight from "../display/lights/PooledPointLight"
import getIntensityFactor from "../utilsCached/getIntensityFactor"
import {
    releasePointLight,
    requestPointLight
} from "../pools/objectPools/pointLightPool"
import scene from "../engine/scene"
import sortedRenderSystemWithData from "./utils/sortedRenderSystemWithData"
import { resetClearNumberPtrSystem } from "./resetNumberPtrSystem"
import { pooledPointLightsPtr } from "../pointers/pooledPointLightsPtr"

const countPtr = [0]
resetClearNumberPtrSystem(countPtr)

export const [addPooledPointLightSystem] = sortedRenderSystemWithData(
    (self: PooledPointLight, data: { visible: boolean }) => {
        const intensityFactor = getIntensityFactor(self)
        const visible =
            !!intensityFactor && ++countPtr[0] <= pooledPointLightsPtr[0]
        if (visible && !data.visible) {
            const light = (self.$light = requestPointLight([], ""))
            self.object3d.add(light.outerObject3d)
            light.distance = self.distance
            light.intensity = self.intensity
            light.color = self.color
            light.shadows = self.shadows
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
