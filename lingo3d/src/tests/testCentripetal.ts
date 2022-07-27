import {
    Cube,
    keyboard,
    Model,
    OrbitCamera,
    Sphere,
    ThirdPersonCamera
} from ".."
import { setCentripetal } from "../states/useCentripetal"

export default {}

const world = new Sphere()
world.physics = "map"
world.scale = 20

setCentripetal(true)

const char = new Model()
char.src = "fox/Fox.fbx"
char.y = 1500
char.physics = "character"

const cam = new ThirdPersonCamera()
cam.append(char)
cam.transition = true
cam.mouseControl = "drag"

keyboard.onKeyPress = (key) => {
    if (key === "w") char.moveForward(-5)
    else if (key === "s") char.moveForward(5)
}

char.boxVisible = true