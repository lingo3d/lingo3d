import settings from "../api/settings"
import OrbitCamera from "../display/cameras/OrbitCamera"
import Model from "../display/Model"

export default {}

const world = new Model()
world.src = "awei/map.glb"
world.resize = false
world.metalnessFactor = 0.1

world.onLoop = () => {
    world.rotationY += 1
}

settings.centripetal = true
settings.texture = "bg.png"

const cam = new OrbitCamera()
cam.active = true
cam.enableZoom = true
