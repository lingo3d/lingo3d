import { deg2Rad, mapRange } from "@lincode/math"
import { Cone, onBeforeRender, SpotLight } from ".."
import settings from "../api/settings"
import Cube from "../display/primitives/Cube"
import { M2CM } from "../globals"

// const updateVolumeGeometry = (light, mesh, radiusTop) => {
//     mesh.material.attenuation = light.distance
// }

settings.defaultLight = false

const ground = new Cube()
ground.y = -300
ground.scaleX = 1000
ground.scaleZ = 1000

const light = new SpotLight()

const cone = new Cone()
cone.emissive = true
light.append(cone)

//equation for diameter of a cone at a given distance

onBeforeRender(() => {
    cone.height = light.distance
    cone.y = -cone.height * 0.5
    cone.width = cone.depth = 2 * Math.tan(light.angle * deg2Rad) * cone.height
})
