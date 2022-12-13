import settings from "../api/settings"
import Model from "../display/Model"
import Cube from "../display/primitives/Cube"

const ground = new Cube()
ground.width = 9999
ground.depth = 9999
ground.y = -200
ground.physics = "map"
ground.metalness = 0.5
ground.roughness = 0
settings.ssr = true

// setInterval(() => {
let box = new Model()
box.src = "parrot.glb"
box.y = 200
box.physics = "convex"

box = new Model()
box.src = "parrot.glb"
box.y = 200
box.x = 100
box.physics = "convex"
// }, 100)
