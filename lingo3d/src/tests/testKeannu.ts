import { PointLight, SkyLight, settings } from ".."
//@ts-ignore
import keanuSrc from "../../assets-local/keannu.glb"
import Model from "../display/Model"

export default {}

const model = new Model()
model.src = keanuSrc
model.scale = 5
model.toon = true

settings.defaultOrbitControls = true

settings.fillWindow = true