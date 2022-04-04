import { PointLight, SkyLight, settings } from ".."
//@ts-ignore
import keanuSrc from "../../assets-local/keannu.glb"
import Model from "../display/Model"

export default {}

const model = new Model()
model.src = keanuSrc
model.scale = 5
model.metalnessFactor = 5
model.roughnessFactor = 0.5

settings.defaultOrbitControls = true
settings.defaultLight = "studio"

settings.fillWindow = true