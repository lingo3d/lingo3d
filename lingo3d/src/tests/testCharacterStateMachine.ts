
import { ThirdPersonCamera, Sky, Dummy } from ".."
import Reflector from "../display/Reflector"
import { setGridHelper } from "../states/useGridHelper"
//@ts-ignore
import roughnessSrc from "../../assets-local/roughness.png"
//@ts-ignore
import normalSrc from "../../assets-local/normal.jpg"
import keyboard from "../api/keyboard"

export default {}

setGridHelper(true)

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.roughnessMap = roughnessSrc
reflector.normalMap = normalSrc
reflector.roughness = 5

const dummy = new Dummy()
dummy.y = 50
dummy.preset = "rifle"

keyboard.onKeyPress = (k) => {
    if (k === "w") {
        dummy.animation = "running"
        dummy.moveForward(-10)
    }
    if (k === "Space")
        dummy.jump()
}

keyboard.onKeyUp = (k) => {
    if (k === "w") {
        dummy.animation = "idle"
    }
}


const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.activate()
cam.mouseControl = true

new Sky()