import keyboard from "../api/keyboard"
import Model from "../display/Model"
import ThirdPersonCamera from "../display/cameras/ThirdPersonCamera"
import settings from "../api/settings"
import Dummy from "../display/Dummy"
import Cube from "../display/primitives/Cube"
import { setAssetsPath } from "../api/assetsPath"

const map = new Model()
map.src = "fairy.glb"
map.scale = 30
map.physics = "map"
map.id = "hello"

const player = new Dummy()
player.src = "ready.glb"
player.z = -100
player.y = 2000
player.physics = "character"
player.rotationY = 90
player.strideMove = true
player.hitTarget = ["hello"]
player.onHitStart = () => console.log("start")
player.onHitEnd = () => console.log("end")

const box = new Cube()
box.z = -300
box.y = 2000
box.physics = true
box.id = "hello"
box.color = "red"

const box2 = new Cube()
box2.z = -300
box2.y = 2100
box2.physics = true

keyboard.onKeyPress = ({ keys }) => {
    if (keys.has("Space")) {
        player.jump()
    }
    if (keys.has("Shift")) {
        box.addLocalForceAtLocalPos(100, 100, 100)
        // box.velocityY = 10
        // box.velocityX = 10
        // box.velocityZ = 10
    }

    if (keys.has("w")) player.strideForward = -5
    else if (keys.has("s")) player.strideForward = 5
    else player.strideForward = 0

    if (keys.has("a")) player.strideRight = 5
    else if (keys.has("d")) player.strideRight = -5
    else player.strideRight = 0
}

const cam = new ThirdPersonCamera()
cam.transition = true
cam.append(player)
cam.mouseControl = "drag"
cam.active = true
cam.lockTargetRotation = "dynamic-lock"
cam.innerX = 50

// const boxes = [
//     { x: -1276.38, y: 2.63, z: -502.67 },
//     { x: -1471.26, y: 2.63, z: -321.88 }
// ].map(({ x, y, z }) => {
//     const model = new Cube()
//     model.x = x
//     model.y = y
//     model.z = z
//     model.physics = true
// })

settings.skybox = [
    "skybox/Left.png",
    "skybox/Right.png",
    "skybox/Up.png",
    "skybox/Down.png",
    "skybox/Front.png",
    "skybox/Back.png"
]
