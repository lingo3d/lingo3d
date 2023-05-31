import PooledSpotLight from "../display/lights/PooledSpotLight"
import getIntensityFactor from "../memo/getIntensityFactor"
import {
    releaseSpotLight,
    requestSpotLight
} from "../pools/objectPools/spotLightPool"
import scene from "../engine/scene"
import { spotLightPoolPtr } from "../pointers/spotLightPoolPtr"
import { clearNumberPtrSystem } from "./clearNumberPtrSystem"
import createSystem from "./utils/createSystem"

const countPtr = [0]
clearNumberPtrSystem.add(countPtr)

export const pooledSpotLightSystem = createSystem("pooledSpotLightSystem", {
    data: { visible: false },
    update: (self: PooledSpotLight, data) => {
        const intensityFactor = getIntensityFactor(self)
        const visible =
            !!intensityFactor && ++countPtr[0] <= spotLightPoolPtr[0]
        if (visible && !data.visible) {
            const light = (self.$light = requestSpotLight([], ""))
            self.object3d.add(light.outerObject3d)
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
            scene.add(light.outerObject3d)
            light.intensity = 0
            self.$light = undefined
        }
        data.visible = visible
    },
    sort: (a, b) => getIntensityFactor(b) - getIntensityFactor(a)
})
