import settings from "../api/settings"
import Cube from "../display/primitives/Cube"
import Sphere from "../display/primitives/Sphere"
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
    let box = new Cube()
    box.y = 200
    box.physics = true

    setTimeout(() => {
        box.dispose()
    }, 10000)
})

const center = new Sphere()
center.color = "red"
center.scale = 0.5
center.y = 600

let foundOld: Array<any> = []

setInterval(() => {
    for (const old of foundOld) {
        old.color = "white"
    }
    for (const found of (foundOld = center
        .spatialQuery(200)
        .filter((v) => v.physics !== "map"))) {
        found.color = "red"
    }
}, 100)
