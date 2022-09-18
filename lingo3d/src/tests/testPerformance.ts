import settings from "../api/settings"
import Model from "../display/Model"

const map = new Model()
map.src = "bugp.glb"
map.scale = 150
map.metalnessFactor = 0
map.roughnessFactor = 0

settings.defaultLight = "studio"
settings.exposure = 0.7