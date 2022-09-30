import { PointLight, SkyLight, settings, Sky, Model } from ".."

const model = new Model()
model.src = "face.glb"
model.scale = 5
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

settings.bloom = true
settings.bloomIntensity = 0.1
