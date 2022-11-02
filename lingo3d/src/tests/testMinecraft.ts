import { Camera, Cube, keyboard, Sky } from ".."

const sky = new Sky()
const floor = new Cube()
floor.width = 9999
floor.depth = 9999
floor.y = -100
floor.physics = "map"
floor.opacity = 0.5

const cam = new Camera()
cam.active = true
cam.mouseControl = true
cam.physics = "character"
cam.height = 200

keyboard.onKeyPress = (key) => {
    if (key === " ") cam.velocity.y = 10
    if (key === "w") cam.moveForward(10)
    if (key === "s") cam.moveForward(-10)
    if (key === "a") cam.moveRight(-10)
    if (key === "d") cam.moveRight(10)
}

const block2 = new Cube()
block2.z = -300
block2.physics = "map"
block2.opacity = 0.5
block2.id = "block"

const block = new Cube()
block.z = -500
block.physics = "map"
block.opacity = 0.5
block.id = "block"

block.onMouseOver = () => {
    block.color = "red"
}
block.onMouseOut = () => {
    block.color = "white"
}

// cam.onLoop = () => {

//     console.log(block.frustumVisible)

//     block.color = "white"
//     block2.color = "white"

//     const blocks = cam.getRayIntersections<Cube>("block")
//     if (blocks.length)
//         blocks[0].color = "red"
// }
