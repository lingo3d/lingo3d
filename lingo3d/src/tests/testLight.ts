import { AreaLight, settings } from ".."
import Cube from "../display/primitives/Cube"

export default {}

let box = new Cube()

let light = new AreaLight()
light.z = 3000
light.y = 3000
light.lookAt(box)

settings.defaultOrbitControls = true