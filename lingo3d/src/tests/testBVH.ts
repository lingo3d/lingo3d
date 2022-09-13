import keyboard from "../api/keyboard"
import Model from "../display/Model"

import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import settings from "../api/settings"
import Dummy from "../display/Dummy"
import visualize from "../display/utils/visualize"

export default {}

const player = new Dummy()
player.src = "ready.glb"
player.z = -100
player.y = 210.59
player.physics = "character"
player.rotationY = 90
player.strideMove = true

keyboard.onKeyPress = (_, key) => {
    if (key.has("w")) player.strideForward = -5
    else if (key.has("s")) player.strideForward = 5
    else player.strideForward = 0

    if (key.has("a")) player.strideRight = 5
    else if (key.has("d")) player.strideRight = -5
    else player.strideRight = 0
}

const cam = new ThirdPersonCamera()
cam.transition = true
cam.append(player)
cam.mouseControl = "drag"
cam.active = true
cam.lockTargetRotation = false

const map = new Model()
map.src = "fairy.glb"
map.scale = 30
map.physics = "map-debug"

settings.skybox = [
    "skybox/Left.png",
    "skybox/Right.png",
    "skybox/Up.png",
    "skybox/Down.png",
    "skybox/Front.png",
    "skybox/Back.png"
]

// map.onClick = (e) => {
//     player.lookTo(e.point.x, undefined, e.point.z, 0.1)
//     cam.lookTo(e.point.x, undefined, e.point.z, 0.1)
//     player.moveTo(e.point.x, undefined, e.point.z, 5)
// }

map.onMouseMove = (e) => {
    visualize("test", e.point)
}
