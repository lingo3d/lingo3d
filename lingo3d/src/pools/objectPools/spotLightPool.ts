import PooledSpotLight from "../../display/lights/PooledSpotLight"
import SpotLight from "../../display/lights/SpotLight"
import scene from "../../engine/scene"
import createObjectPool from "../utils/createObjectPool"

export const spotLightPool = createObjectPool<SpotLight, [], PooledSpotLight>(
    () => {
        const light = new SpotLight()
        light.intensity = 0
        light.$ghost()
        return light
    },
    (light) => {
        light.dispose()
    },
    (light, self) => {
        light.distance = self.distance
        light.intensity = self.intensity
        light.color = self.color
        light.shadows = self.shadows
        light.fade = self.fade
        light.angle = self.angle
        light.penumbra = self.penumbra
        light.volumetric = self.volumetric
        light.volumetricDistance = self.volumetricDistance
        self.object3d.add(light.outerObject3d)
    },
    (light) => {
        light.fade = false
        light.intensity = 0
        scene.add(light.outerObject3d)
    }
)
