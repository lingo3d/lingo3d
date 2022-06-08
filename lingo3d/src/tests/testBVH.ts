import keyboard from "../api/keyboard"
import Model from "../display/Model"
//@ts-ignore
import fairySrc from "../../assets-local/fairy.glb"
//@ts-ignore
import personSrc from "../../assets-local/person.glb"
//@ts-ignore
import runningSrc from "../../assets-local/running 2.fbx"
//@ts-ignore
import idleSrc from "../../assets-local/idle 2.fbx"
//@ts-ignore
import BackSrc from "../../assets-local/skybox/Back.png"
//@ts-ignore
import DownSrc from "../../assets-local/skybox/Down.png"
//@ts-ignore
import FrontSrc from "../../assets-local/skybox/Front.png"
//@ts-ignore
import LeftSrc from "../../assets-local/skybox/Left.png"
//@ts-ignore
import RightSrc from "../../assets-local/skybox/Right.png"
//@ts-ignore
import UpSrc from "../../assets-local/skybox/Up.png"

import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import settings from "../api/settings"

export default {}

const player = new Model()
player.src = personSrc
player.width = 20
player.depth = 20
player.z = -100
player.y = 210.59
player.physics = "character"
player.animations = { running: runningSrc, idle: idleSrc }
player.animation = "idle"
player.rotationY = 90

keyboard.onKeyPress = (k) => {
    if (k === "w") {
        player.moveForward(-5)
        player.animation = "running"
    }
    if (k === "s") player.moveForward(5)
    if (k === "a") player.moveRight(5)
    if (k === "d") player.moveRight(-5)
    if (k === "Space") player.velocity.y = 5
}

keyboard.onKeyUp = () => {
    player.animation = "idle"
}

const cam = new ThirdPersonCamera()
cam.append(player)
cam.mouseControl = true
cam.active = true

const map = new Model()
map.src = fairySrc
map.scale = 20
map.physics = "map"

settings.skybox = [LeftSrc, RightSrc, UpSrc, DownSrc, FrontSrc, BackSrc]