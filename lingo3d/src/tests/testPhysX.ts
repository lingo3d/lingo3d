import settings from "../api/settings"
import Cube from "../display/primitives/Cube"

const ground = new Cube()
ground.width = 9999
ground.depth = 9999
ground.y = -200
ground.physics = "map"
ground.metalness = 0.5
ground.roughness = 0
settings.ssr = true

ground.hitTarget = "box"
ground.onHitStart = (item: any) => {
    item.color = "red"
}
ground.onHitEnd = (item: any) => {
    item.color = "white"
}

// timer(100, -1, () => {
//     let box = new Cube()
//     box.y = 200
//     box.physics = true
//     box.id = "box"

//     // setTimeout(() => {
//     //     box.dispose()
//     // }, 10000)
// })
