//@ts-ignore
import botSrc from "../../assets-local/bot.fbx"
//@ts-ignore
import runningSrc from "../../assets-local/running.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle.fbx"
//@ts-ignore
import texture from "../../assets-local/f6.png"

import Model from "../display/Model"
import keyboard from "../api/keyboard"
import { Camera, settings, ThirdPersonCamera } from ".."
import Cube from "../display/primitives/Cube"

export default {}

settings.defaultOrbitControls = true

const model = new Model()
model.src = botSrc
model.width = 30
model.depth = 30

model.loadAnimation(runningSrc, "running")
model.loadAnimation(idleSrc, "idle")
model.playAnimation("idle")
model.pbr = true

keyboard.onKeyDown = (key) => {
    if (key === "w")
        model.playAnimation("running")
}

keyboard.onKeyUp = (key) => {
    if (key === "w")
        model.playAnimation("idle")
}

let cam = new ThirdPersonCamera()
cam.append(model)

const floor = new Cube()
floor.width = 500
floor.depth = 500
floor.y = -100
floor.texture = texture
floor.textureRepeat = 10