import Joint from "../display/Joint"
import Cube from "../display/primitives/Cube"

const ground = new Cube()
ground.width = 999
ground.height = 10
ground.depth = 999
ground.y = -300
ground.color = "blue"
ground.physics = "map"

const cube0 = new Cube()
cube0.scale = 0.5

const cube1 = new Cube()
cube1.x = -110
cube1.z = 100
// cube1.rotationX = 45
// cube1.rotationY = 45
// cube1.rotationZ = 45
cube1.scale = 0.5
cube1.color = "red"

const joint0 = new Joint()
joint0.x = -50
joint0.from = cube0
joint0.to = cube1
