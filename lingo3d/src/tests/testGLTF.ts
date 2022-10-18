import settings from "../api/settings"
import Model from "../display/Model"

const model = new Model()
model.src = "map.glb"
model.scale = 200
model.roughnessFactor = 0
settings.ssr = true