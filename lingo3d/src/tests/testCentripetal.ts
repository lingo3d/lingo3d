import { deg2Rad, distance, distance3d, mapRange } from "@lincode/math"
import { Dummy, keyboard, Model, settings, Sky, Sphere, ThirdPersonCamera } from ".."
import { setCentripetal } from "../states/useCentripetal"

export default {}

const world = new Sphere()
world.physics = "map"
world.scale = 20
world.texture = "basecolor.png"

setCentripetal(true)

const player = new Dummy()
player.y = 1500
player.physics = "character"
player.strideMove = true
player.strideMode = "free"

const cam = new ThirdPersonCamera()
cam.append(player)
cam.transition = true
cam.mouseControl = "drag"

keyboard.onKeyPress = (_, key) => {
    if (key.has("w"))
        player.strideForward = -5
    else if (key.has("s"))
        player.strideForward = 5
    else
        player.strideForward = 0

    if (key.has("a"))
        player.strideRight = 5
    else if (key.has("d"))
        player.strideRight = -5
    else
        player.strideRight = 0
}

const sky = new Sky()

settings.defaultLight = "studio"
player.roughnessFactor = 0.1
world.roughness = 0.3
player.boxVisible = true