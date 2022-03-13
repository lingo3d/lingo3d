import { DirectionalLight, PointLight, SkyLight, settings } from ".."
//@ts-ignore
import parrotSrc from "../../assets-local/keannu.glb"
import Model from "../display/Model"

const model = new Model()
model.src = parrotSrc
model.scale = 5

settings.defaultLight = false

const sky = new SkyLight()
sky.intensity = 0.5

const light = new PointLight()
light.z = 500

const light2 = new PointLight()
light2.z = -500

settings.containerWidth = window.innerWidth
settings.containerHeight = window.innerHeight