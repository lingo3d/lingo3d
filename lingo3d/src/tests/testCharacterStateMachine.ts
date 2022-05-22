
import { mouse, keyboard, ThirdPersonCamera, Sky, Model } from ".."
import Reflector from "../display/Reflector"
import { setGridHelper } from "../states/useGridHelper"
//@ts-ignore
import roughnessSrc from "../../assets-local/roughness.png"
//@ts-ignore
import normalSrc from "../../assets-local/normal.jpg"
//@ts-ignore
import botSrc from "../../assets-local/bot.fbx"

export default {}

setGridHelper(true)

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.roughnessMap = roughnessSrc
reflector.normalMap = normalSrc
reflector.roughness = 5

const characterModel = new Model()
characterModel.src = botSrc
characterModel.width = 30
characterModel.depth = 30
characterModel.y = 50

const cam = new ThirdPersonCamera()
cam.append(characterModel)
cam.activate()
cam.mouseControl = true
characterModel.physics = "character"
characterModel.pbr = true

new Sky()