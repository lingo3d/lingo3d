import Model from "../display/Model"
import Sky from "../display/Sky"
import Cube from "../display/primitives/Cube"
import FirstPersonCamera from "../display/cameras/FirstPersonCamera"
import { setWebXR } from "../states/useWebXR"
import { keyboard } from ".."

setWebXR(true)

const player = new Cube()
player.width = 50
player.depth = 50
player.z = -100
player.y = 500
player.physics = "character"

keyboard.onKeyPress = (e) => {
    if (e.key === "w") player.moveForward(-10)
    if (e.key === "s") player.moveForward(10)
    if (e.key === "a") player.moveRight(10)
    if (e.key === "d") player.moveRight(-10)
    if (e.key === "Space") player.velocityY = 10
}

const cam = new FirstPersonCamera()
cam.append(player)
cam.mouseControl = "drag"
cam.active = true

const map = new Model()
map.src = "fairy.glb"
map.scale = 20
map.physics = "map"

player.visible = false

const sky = new Sky()
