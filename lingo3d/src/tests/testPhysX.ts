import settings from "../api/settings"
import Model from "../display/Model"
import Cube from "../display/primitives/Cube"
import { timer } from "../engine/eventLoop"

const ground = new Cube()
ground.width = 9999
ground.depth = 9999
ground.y = -200
ground.physics = "map"
ground.metalness = 0.5
ground.roughness = 0
settings.ssr = true

timer(100, -1, () => {
    let box = new Model()
    box.src = "parrot.glb"
    box.y = 200
    box.physics = "convex"

    setTimeout(() => {
        box.dispose()
    }, 1000)
})
