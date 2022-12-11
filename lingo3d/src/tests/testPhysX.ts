import settings from "../api/settings"
import Cube from "../display/primitives/Cube"
import Octahedron from "../display/primitives/Octahedron"

const ground = new Cube()
ground.width = 9999
ground.depth = 9999
ground.y = -200
ground.physics = "map"
ground.metalness = 0.5
ground.roughness = 0
settings.ssr = true

// setInterval(() => {
const box = new Octahedron()
box.y = 200
box.color = "red"
box.physics = "convex"
box.roughness = 0
box.metalness = 0.5
// }, 100)
