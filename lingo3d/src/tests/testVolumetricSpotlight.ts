import { settings, SpotLight } from ".."
import Cube from "../display/primitives/Cube"

// const updateVolumeGeometry = (light, mesh, radiusTop) => {
//     mesh.material.attenuation = light.distance
// }

settings.defaultLight = false

const ground = new Cube()
ground.y = -300
ground.scaleX = 1000
ground.scaleZ = 1000

const spotLight = new SpotLight()

