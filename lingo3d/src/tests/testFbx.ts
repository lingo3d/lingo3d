//@ts-ignore
import botSrc from "../../assets-local/map.glb"
//@ts-ignore
import runningSrc from "../../assets-local/running.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle.fbx"

import Model from "../display/Model"
import keyboard from "../api/keyboard"
import { settings, ThirdPersonCamera } from ".."
import Cube from "../display/primitives/Cube"

export default {}

settings.defaultOrbitControls = true
settings.defaultLight = "studio"

const model = new Model()
model.src = botSrc

let cam = new ThirdPersonCamera()
cam.append(model)