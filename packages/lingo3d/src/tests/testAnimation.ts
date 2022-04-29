import { background } from ".."
import Cube from "../display/primitives/Cube"
import Skybox from "../display/Skybox"

export default {}

const box = new Cube()

box.texture = [
    require("../../assets-local/f1.png"),
    require("../../assets-local/f2.png"),
    require("../../assets-local/f3.png"),
    require("../../assets-local/f4.png"),
    require("../../assets-local/f5.png"),
    require("../../assets-local/f6.png")
]

box.animation = {
    rotationX: [0, 45, 0]
}

box.animation.rotationY = [0, 45, 0]

// setTimeout(() => {
//     box.enablePhysics()
// }, 1000)

// let floor = new Cube()
// floor.width = 1000
// floor.height = 20
// floor.depth = 1000
// floor.y = -200
// floor.mass = 0
// floor.enablePhysics()

// const animation = box.createAnimation()
// animation.setTracks({
//     opacity: {
//         0: 0,
//         1: 1,
//         2: 0
//     },
//     y: {
//         0: 0,
//         1: 100,
//         2: 0
//     },
//     rotationY: {
//         0: 0,
//         1: 180,
//         2: 0
//     }
// })


// // animation.update(0.3)
// animation.play()

// const skybox = new Skybox()
// skybox.texture = brickDiffuseSrc

// const cube = new Cube()
// cube.animation.rotationX = [0, 30, 0, 30, 0, 30, 0, 30, 0, 30, 0, 30]

background.texture = require("../../assets-local/bg.jpg")