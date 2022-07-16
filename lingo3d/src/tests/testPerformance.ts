import settings from "../api/settings"
import Model from "../display/Model"

export default {}

const map = new Model()
map.src = "bugp.glb"
map.scale = 150
map.metalnessFactor = 0
map.roughnessFactor = 0

settings.defaultLight = "studio"
settings.defaultLightScale = 2
settings.exposure = 0.7