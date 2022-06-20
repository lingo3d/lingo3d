import Model from "../display/Model"
import settings from "../api/settings"
import AreaLight from "../display/lights/AreaLight"

export default {}

const model = new Model()
model.src = "casa2.glb"
model.scale = 3

settings.defaultOrbitControls = true
settings.defaultLight = "hdrnightvison.hdr"
settings.skybox = "hdrnightvison.hdr"

const rectLight = new AreaLight()
rectLight.rotationX = -90
rectLight.y = 1000
rectLight.scale = 100

settings.bloom = true
settings.bloomStrength = 0.1