import keyboard from "../api/keyboard"
import settings from "../api/settings"
import Model from "../display/Model"
//@ts-ignore
import fairySrc from "../../assets-local/fairy.glb"
import Sky from "../display/Sky"
import Cube from "../display/primitives/Cube"
import FirstPersonCamera from "../display/cameras/FirstPersonCamera"

export default {}

settings.defaultOrbitControls = true
settings.fillWindow = true

const player = new Cube()
player.width = 50
player.depth = 50
player.z = -100
player.y = 500
player.physics = "character"

keyboard.onKeyPress = (k) => {
    if (k === "w") player.moveForward(-10)
    if (k === "s") player.moveForward(10)
    if (k === "a") player.moveRight(10)
    if (k === "d") player.moveRight(-10)
    if (k === " ") player.velocity.y = 10
}

const cam = new FirstPersonCamera()
cam.target = player
cam.mouseControl = "drag"
cam.active = true

const map = new Model()
map.src = fairySrc
map.scale = 20
map.physics = "map"

player.visible = false

const sky = new Sky()