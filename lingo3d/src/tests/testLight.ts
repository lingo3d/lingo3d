import { PointLight, settings } from ".."
import Cube from "../display/primitives/Cube"

settings.defaultLight = false

const ground = new Cube()
ground.y = -300
ground.scaleX = 1000
ground.scaleZ = 1000

const light = new PointLight()

const cube = new Cube()
cube.y = -100
cube.physics = "static"
