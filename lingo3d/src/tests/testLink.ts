import { settings } from ".."
import Model from "../display/Model"

export default {}

const model = new Model()
model.src = "link.glb"
model.scale = 5
model.toon = true
model.frustumCulled = false

model.onClick = ({ distance }) => {
    console.log(distance)
}

// model.animations = {
//     running: runningSrc,
//     idle: idleSrc
// }
// model.animation = ["running", "idle"]

settings.defaultOrbitControls = true