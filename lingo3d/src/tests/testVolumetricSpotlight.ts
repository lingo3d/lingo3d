import { onBeforeRender, PointLight, settings, SpotLight } from ".."
import Cube from "../display/primitives/Cube"

// const updateVolumeGeometry = (light, mesh, radiusTop) => {
//     mesh.material.attenuation = light.distance
// }

settings.defaultLight = false

const ground = new Cube()
ground.y = -300
ground.scaleX = 1000
ground.scaleZ = 1000

const light = new PointLight()
light.castShadow = true

// const spotLight = new SpotLight()
// spotLight.castShadow = true

const cube = new Cube()
cube.y = -100
cube.physics = "static"

onBeforeRender(() => {
    console.log(light.queryNearby(100).length)
})
