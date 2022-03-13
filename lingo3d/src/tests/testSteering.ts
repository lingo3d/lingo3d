import keyboard from "../api/keyboard"
import Cube from "../display/primitives/Cube"
//@ts-ignore
import parrotSrc from "../../assets-local/parrot.glb"
import Model from "../display/Model"

const floor = new Cube()
floor.width = 1000
floor.height = 20
floor.depth = 1000
floor.y = -200
floor.physics = true
floor.mass = 0

const box = new Model()
box.src = parrotSrc
box.scale = 3
box.physics = true
box.slippery = true
box.maxAngularVelocityY = 10

keyboard.onKeyPress = (k) => {
    if (k === "w")
        box.moveForward(10)
    else if (k === "s")
        box.moveForward(-10)
    else if (k === "a")
        box.applyTorque(0, -100, 0)
    else if (k === "d")
        box.applyTorque(0, 100, 0)
}