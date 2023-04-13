import { Cube, PointLight, onBeforeRender } from ".."
import settings from "../api/settings"
import Dummy from "../display/Dummy"
import Model from "../display/Model"

settings.defaultLight = false

const player = new Dummy()

const light = new PointLight()
light.castShadow = true
light.innerX = 300

const ground = new Cube()
ground.y = -100
ground.height = 20
ground.depth = 9999
ground.width = 9999

light.onLoop = () => {
    light.rotateY(5)
}

// player.src = "hand.glb"
// player.animationPaused = true
