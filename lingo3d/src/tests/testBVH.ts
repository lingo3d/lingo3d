import keyboard from "../api/keyboard"
import settings from "../api/settings"
import Model from "../display/Model"
//@ts-ignore
import fairySrc from "../../assets-local/fairy.glb"
//@ts-ignore
import keannuSrc from "../../assets-local/keannu.glb"
import FirstPersonCamera from "../display/cameras/FirstPersonCamera"
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"

export default {}

settings.defaultOrbitControls = true
settings.fillWindow = true

const player = new Model()
player.src = keannuSrc
player.width = 20
player.depth = 20
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

const cam = new ThirdPersonCamera()
cam.target = player
cam.active = true
cam.mouseControl = true

const map = new Model()
map.src = fairySrc
map.scale = 20
map.physics = "map"