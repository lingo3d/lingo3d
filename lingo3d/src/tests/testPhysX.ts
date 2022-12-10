import Cube from "../display/primitives/Cube"

const box = new Cube()
box.y = 200
box.color = "red"
box.physics = true

const ground = new Cube()
ground.width = 9999
ground.depth = 9999
ground.y = -200
ground.physics = "map"

