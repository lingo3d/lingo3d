import { Camera, Cube, keyboard, settings, Sky } from ".."

export default {}

settings.fillWindow = true

const sky = new Sky()
const floor = new Cube()
floor.width = 9999
floor.depth = 9999
floor.y = -100
floor.physics = true
floor.mass = 0
floor.opacity = 0.5

const cam = new Camera()
cam.activate()
cam.mouseControl = true
cam.physics = true
cam.noTumble = true
cam.height = 200

keyboard.onKeyPress = (key) => {
    if (key === " ")
        cam.applyImpulse(0, 10, 0)
    if (key === "w")
        cam.moveForward(10)
    if (key === "s")
        cam.moveForward(-10)
    if (key === "a")
        cam.moveRight(-10)
    if (key === "d")
        cam.moveRight(10)
}

const block2 = new Cube()
block2.z = -300
block2.physics = true
block2.opacity = 0.5
block2.id = "block"

const block = new Cube()
block.z = -500
block.physics = true
block.opacity = 0.5
block.id = "block"

cam.onLoop = () => {
    block.color = "white"
    block2.color = "white"

    const blocks = cam.getRayIntersections<Cube>("block")
    if (blocks.length)
        blocks[0].color = "red"
}