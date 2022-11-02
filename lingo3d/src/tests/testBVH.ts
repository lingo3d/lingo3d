import keyboard from "../api/keyboard"
import Model from "../display/Model"

import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import settings from "../api/settings"
import Dummy from "../display/Dummy"
import Cube from "../display/primitives/Cube"

const player = new Dummy()
player.src = "ready.glb"
player.z = -100
player.y = 300
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
cam.lockTargetRotation = "dynamic-lock"

const map = new Model()
map.src = "fairy.glb"
map.scale = 30
map.physics = "map"

const boxes = [
    { x: -1276.38, y: 2.63, z: -502.67 },
    { x: -1471.26, y: 2.63, z: -321.88 }
].map(({ x, y, z }) => {
    const model = new Cube()
    model.x = x
    model.y = y
    model.z = z
    model.physics = "map-debug"
})

settings.skybox = [
    "skybox/Left.png",
    "skybox/Right.png",
    "skybox/Up.png",
    "skybox/Down.png",
    "skybox/Front.png",
    "skybox/Back.png"
]
