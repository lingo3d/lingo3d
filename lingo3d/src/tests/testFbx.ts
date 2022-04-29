//@ts-ignore
import botSrc from "../../assets-local/myTwoGirl.fbx"
//@ts-ignore
import runningSrc from "../../assets-local/running.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle.fbx"

import Model from "../display/Model"
import keyboard from "../api/keyboard"
import { Camera, settings, ThirdPersonCamera } from ".."

export default {}

settings.defaultOrbitControls = true
settings.defaultLight = "studio"

const model = new Model()
model.src = botSrc
model.width = 30
model.depth = 30
model.pbr = true

let cam = new ThirdPersonCamera()
cam.append(model)