import Cube from "../display/primitives/Cube"

export default {}

const box = new Cube()

box.animation = {
    rotationX: [0, 45, 0]
}

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