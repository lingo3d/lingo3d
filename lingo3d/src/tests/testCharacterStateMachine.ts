
import { Reflector, mouse, keyboard, rendering, settings } from ".."
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import makeCharacter from "./utils/makeCharacter"

export default {}

settings.fillWindow = true
rendering.bloom = true
rendering.bloomStrength = 0.5
settings.gridHelper = true

const reflector = new Reflector()
reflector.width = 10000
reflector.height = 10000
reflector.rotationX = -90
reflector.shape = "circle"
reflector.contrast = 0.5
reflector.blur = 2
reflector.physics = true
reflector.mass = 0

const { characterModel, characterService } = makeCharacter()

characterModel.physics = true

const cam = new ThirdPersonCamera()
cam.target = characterModel
cam.activate()
cam.mouseControl = true
cam.innerX = 20

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