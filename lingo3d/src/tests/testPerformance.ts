import settings from "../api/settings"
import Model from "../display/Model"
import Dummy from "../display/Dummy"

export default {}

const map = new Model()
map.src = "bugp.glb"
map.scale = 150
map.pbr = true
map.metalnessFactor = 1
map.roughnessFactor = 0.4

settings.defaultLight = "studio"
settings.defaultLightScale = 2
settings.exposure = 0.7

const dummy = new Dummy()