import { AreaLight, DefaultSkyLight, PointLight, SpotLight, settings } from ".."
import Cube from "../display/primitives/Cube"

const skylight = new DefaultSkyLight()
skylight.intensity = 0.2

const ground = new Cube()
ground.y = -300
ground.scaleX = 1000
ground.scaleZ = 1000

const light = new AreaLight()
// light.castShadow = true

const cube = new Cube()
cube.y = -100
cube.physics = "static"
