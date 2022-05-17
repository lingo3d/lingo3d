import { PointLight, SkyLight, settings, Sky, Reflector } from ".."
//@ts-ignore
import faceSrc from "../../assets-local/face.glb"
import Model from "../display/Model"

export default {}

const model = new Model()
model.src = faceSrc
model.scale = 5
model.playAnimation()
model.y = 300

settings.defaultLight = false

const skylight = new SkyLight()

const light = new PointLight()
light.innerZ = 500
light.intensity = 0.5
light.y = 400

light.onLoop = () => {
    light.rotationY += 1
}

const light3 = new PointLight()
light3.innerZ = 500
light3.rotationY = 45
light3.intensity = 0.5

const sky = new Sky()

// settings.performance = "quality"
settings.defaultOrbitControls = true
settings.ambientOcclusion = true
settings.bloom = true
settings.bloomStrength = 0.1

const reflector = new Reflector()

// const cube = new Cube()
// cube.height = 20
// cube.width = 9999
// cube.depth = 9999
// cube.opacity = 0.001

// cube.reflection = true