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
cube1.y = -110
cube1.scale = 0.5
cube1.color = "red"
cube1.rotationX = 45
cube1.rotationY = 45
cube1.rotationZ = 45

const cube2 = new Cube()
cube2.y = -220
cube2.scale = 0.5
cube2.color = "yellow"
cube2.rotationX = 45
cube2.rotationY = 45
cube2.rotationZ = 45

// const joint0 = new Joint()
// joint0.from = cube0
// joint0.to = cube1
// joint0.fixed = true

// const joint1 = new Joint()
// joint1.from = cube1
// joint1.to = cube2
