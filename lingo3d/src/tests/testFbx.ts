//@ts-ignore
import botSrc from "../../assets-local/map.glb"
//@ts-ignore
import runningSrc from "../../assets-local/running.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle.fbx"

import { settings, Model } from ".."

export default {}

settings.defaultOrbitControls = true
settings.defaultLight = "studio"

const model = new Model()
model.src = botSrc
model.scale = 150
model.pbr = true