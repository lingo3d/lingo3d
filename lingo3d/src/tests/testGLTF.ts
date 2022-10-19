import settings from "../api/settings"
import Model from "../display/Model"

const model = new Model()
model.src = "remember/city.glb"
model.scale = 100
settings.ssr = true