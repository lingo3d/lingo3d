import keyboard from "../api/keyboard"
import settings from "../api/settings"
import Model from "../display/Model"
//@ts-ignore
import fairySrc from "../../assets-local/fairy.glb"
//@ts-ignore
import personSrc from "../../assets-local/person.glb"
//@ts-ignore
import runningSrc from "../../assets-local/running 2.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle 2.fbx"

import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import Sky from "../display/Sky"
import rendering from "../api/rendering"

export default {}

settings.defaultOrbitControls = true
settings.fillWindow = true

const player = new Model()
player.src = personSrc
player.width = 20
player.depth = 20
player.z = -100
player.y = 500
player.physics = "character"
player.animations = { running: runningSrc, idle: idleSrc }
player.animation = "idle"
player.boxVisible = true
player.rotationY = 90

keyboard.onKeyPress = (k) => {
    if (k === "w") {
        player.moveForward(-5)
        player.animation = "running"
    }
    if (k === "s") player.moveForward(5)
    if (k === "a") player.moveRight(5)
    if (k === "d") player.moveRight(-5)
    if (k === " ") player.velocity.y = 5
}

keyboard.onKeyUp = () => {
    player.animation = "idle"
}

const cam = new ThirdPersonCamera()
cam.target = player
cam.mouseControl = true
cam.active = true

const map = new Model()
map.src = fairySrc
map.scale = 20
map.physics = "map"

const sky = new Sky()

rendering.ambientOcclusion = true