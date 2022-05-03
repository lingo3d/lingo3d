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
//@ts-ignore
import f1Src from "../../assets-local/f2.png"
//@ts-ignore
import waveSrc from "../../assets-local/wave1.mp4"

import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import Sky from "../display/Sky"
import rendering from "../api/rendering"
import Skybox from "../display/Skybox"
import Cube from "../display/primitives/Cube"

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
map.onLoad = () => {
    const found = map.find("a6_CRN.a6_0")
    if (found) {
        found.texture = "https://wallpaperm.cmcm.com/scene/preview_video/cee07dd162e47ae0fdd86e534fac7550_preview.mp4"
    }
}

// const sky = new Sky()

const skybox = new Skybox()
skybox.texture = [LeftSrc, RightSrc, UpSrc, DownSrc, FrontSrc, BackSrc]

const cube = new Cube()