import { Dummy, keyboard, Model, settings, ThirdPersonCamera } from ".."
import { YBOT_URL } from "../globals"
import { setCentripetal } from "../states/useCentripetal"

export default {}

const world = new Model()
world.physics = "map"
world.scale = 40
world.src = "waic.glb"
world.resize = false
world.roughnessFactor = 2

setCentripetal(true)

const player = new Dummy()
player.y = 4000
player.physics = "character"
player.strideMove = true
player.strideMode = "free"
player.boxVisible = true

const cam = new ThirdPersonCamera()
cam.append(player)
cam.transition = true
cam.mouseControl = true
cam.innerZ = 1000
cam.lockTargetRotation = "dynamic-lock"

keyboard.onKeyPress = (_, key) => {
    if (key.has("w")) player.strideForward = -10
    else if (key.has("s")) player.strideForward = 10
    else player.strideForward = 0

    if (key.has("a")) player.strideRight = 10
    else if (key.has("d")) player.strideRight = -10
    else player.strideRight = 0
}

keyboard.onKeyDown = (key) => {
    if (key === "Space")
        player.src = player.src === "player2.glb" ? YBOT_URL : "player2.glb"
}

settings.texture = "bg.png"
