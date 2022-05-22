
import { mouse, keyboard, ThirdPersonCamera, Sky } from ".."
import Reflector from "../display/Reflector"
import { setGridHelper } from "../states/useGridHelper"
import makeCharacter from "./utils/makeCharacter"
//@ts-ignore
import roughnessSrc from "../../assets-local/roughness.png"
//@ts-ignore
import normalSrc from "../../assets-local/normal.jpg"

export default {}

setGridHelper(true)

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.roughnessMap = roughnessSrc
reflector.normalMap = normalSrc
reflector.roughness = 5

const { characterModel, characterService } = makeCharacter()

const cam = new ThirdPersonCamera()
cam.append(characterModel)
cam.activate()
cam.mouseControl = true
cam.innerX = 20
characterModel.physics = "character"
characterModel.pbr = true

mouse.onMouseDown = () => {
    characterService.send("AIM_ON")
}

mouse.onMouseUp = () => {
    characterService.send("AIM_OFF")
}

keyboard.onKeyPress = (key) => {
    if (key === "w")
        characterService.send("MOVE_ON")
    else if (key === " ")
        characterService.send("JUMP_ON")
}

keyboard.onKeyUp = (key) => {
    if (key === "w")
        characterService.send("MOVE_OFF")
}

let speed = 0
characterModel.onLoop = () => {
    characterModel.moveForward(speed)
}

let interval: any
characterService.onTransition(({ value, changed }) => {
    if (!changed) return

    if (value === "idle") {
        speed = 0
        clearInterval(interval)
    }
    else if (value === "move")
        speed = -5
    else if (value === "aimMove")
        speed = -1
    else if (value === "jump") {
        characterModel.applyImpulse(0, 10, 0)
        interval = setInterval(() => characterModel.intersects(reflector) && characterService.send("JUMP_OFF"), 100)
    }
})

new Sky()