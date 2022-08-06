import { settings, Model } from ".."

export default {}

settings.defaultLight = "studio"

const model = new Model()
model.src = "map.glb"
model.scale = 150