import { PointLight, SkyLight, settings } from ".."
//@ts-ignore
import keanuSrc from "../../assets-local/keannu.glb"
//@ts-ignore
import hdrSrc from "../../assets-local/studio010.hdr"
import Model from "../display/Model"

export default {}

settings.performance = "quality"

const model = new Model()
model.src = keanuSrc
model.scale = 5
model.metalnessFactor = 5
model.roughnessFactor = 0.5

settings.defaultOrbitControls = true
settings.defaultLight = hdrSrc

settings.texture = hdrSrc