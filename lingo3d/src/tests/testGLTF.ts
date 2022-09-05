import settings from "../api/settings"
import OrbitCamera from "../display/cameras/OrbitCamera"
import Model from "../display/Model"

export default {}

settings.defaultLight = "studio"

const map = new Model()
map.src = "map.glb"
map.scale = 100
map.metalnessFactor = 2
map.roughnessFactor = 0.01