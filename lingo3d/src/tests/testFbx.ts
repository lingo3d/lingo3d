//@ts-ignore
import botSrc from "../../assets-local/bot.fbx"
//@ts-ignore
import runningSrc from "../../assets-local/running.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle.fbx"

import Model from "../display/Model"
import keyboard from "../api/keyboard"
import { Camera, settings, ThirdPersonCamera } from ".."

export default {}

settings.fillWindow = true
settings.defaultOrbitControls = true

const model = new Model()
model.src = botSrc
model.width = 30
model.depth = 30

model.loadAnimation(runningSrc, "running")
model.loadAnimation(idleSrc, "idle")
model.playAnimation("idle")

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