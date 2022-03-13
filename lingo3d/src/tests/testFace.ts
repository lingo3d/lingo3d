import { DirectionalLight, PointLight, SkyLight, settings, Sky, rendering, Cube, Reflector, GroundReflector } from ".."
//@ts-ignore
import faceSrc from "../../assets-local/face.glb"
import Model from "../display/Model"
import { setOrbitControls } from "../states/useOrbitControls"

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

settings.containerWidth = window.innerWidth
settings.containerHeight = window.innerHeight

const sky = new Sky()

// settings.performance = "quality"
settings.defaultOrbitControls = true
rendering.ambientOcclusion = true
rendering.bloom = true
rendering.bloomStrength = 0.1

const reflector = new GroundReflector()

// const cube = new Cube()
// cube.height = 20
// cube.width = 9999
// cube.depth = 9999
// cube.opacity = 0.001

// cube.reflection = true