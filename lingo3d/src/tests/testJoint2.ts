import Joint from "../display/Joint"
import Cube from "../display/primitives/Cube"

const cube0 = new Cube()
cube0.y = 100
cube0.scale = 0.5

const cube1 = new Cube()
cube1.y = 100
cube1.x = -110
cube1.scale = 0.5

const cube2 = new Cube()
cube2.y = 100
cube2.x = -220
cube2.scale = 0.5

const joint0 = new Joint()
joint0.y = 100
joint0.x = -50
joint0.from = cube0
joint0.to = cube1
