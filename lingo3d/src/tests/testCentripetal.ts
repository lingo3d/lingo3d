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

keyboard.onKeyPress = (key) => {
    if (key === "w") char.translateZ(-5)
    else if (key === "a") char.translateX(-5)
    else if (key === "s") char.translateY(-5)
}
