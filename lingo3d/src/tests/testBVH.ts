import keyboard from "../api/keyboard"
import Model from "../display/Model"

import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import settings from "../api/settings"

export default {}

const player = new Model()
player.src = "person.glb"
player.width = 20
player.depth = 20
player.z = -100
player.y = 210.59
player.physics = "character"
player.animations = { running: "running 2.fbx", idle: "idle 2.fbx" }
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
cam.transition = true
cam.append(player)
cam.mouseControl = true
cam.active = true

const map = new Model()
map.src = "fairy.glb"
map.scale = 20
map.physics = "map"

settings.skybox = [
    "skybox/Left.png", "skybox/Right.png", "skybox/Up.png", "skybox/Down.png", "skybox/Front.png", "skybox/Back.png"
]