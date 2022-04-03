import { PointLight, SkyLight, settings } from ".."
//@ts-ignore
import keanuSrc from "../../assets-local/link.glb"
import Model from "../display/Model"

export default {}

const model = new Model()
model.src = keanuSrc
model.scale = 5
model.toon = true
model.frustumCulled = false
model.animation = 1

settings.defaultOrbitControls = true

settings.fillWindow = true