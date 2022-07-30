import { Dummy, keyboard, Model, OrbitCamera, settings, Sky, Sphere, ThirdPersonCamera } from ".."
import { setCentripetal } from "../states/useCentripetal"

export default {}

const world = new Model()
world.physics = "map"
world.scale = 40
world.src = "waic.glb"
world.loadedScale = 1

setCentripetal(true)

const player = new Dummy()
player.y = 4000
player.physics = "character"
player.strideMove = true
player.strideMode = "free"

const cam = new ThirdPersonCamera()
cam.append(player)
cam.transition = true
cam.mouseControl = "drag"
cam.innerZ = 1000

keyboard.onKeyPress = (_, key) => {
    if (key.has("w"))
        player.strideForward = -10
    else if (key.has("s"))
        player.strideForward = 10
    else
        player.strideForward = 0

    if (key.has("a"))
        player.strideRight = 10
    else if (key.has("d"))
        player.strideRight = -10
    else
        player.strideRight = 0
}

settings.texture = "bg.png"
settings.defaultLight = "studio"