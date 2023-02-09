import settings from "../api/settings"
import VisibleObjectManager from "../display/core/VisibleObjectManager"
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

let foundOld: Array<VisibleObjectManager> = []

setInterval(() => {
    for (const old of foundOld) {
        //@ts-ignore
        old.color = "white"
    }
    for (const found of (foundOld = center
        .findByDistance(200)
        //@ts-ignore
        .filter((v) => v.physics !== "map"))) {
        //@ts-ignore
        found.color = "red"
    }
}, 100)
