import { settings } from ".."
import Model from "../display/Model"

export default {}

const model = new Model()
model.src = "keannu.glb"
model.scale = 5
model.metalnessFactor = 5
model.roughnessFactor = 0.5

model.onLoop = () => {
    model.rotationY += 1
}

settings.defaultOrbitControls = true
settings.defaultLight = "studio010.hdr"

settings.skybox = "studio010.hdr"