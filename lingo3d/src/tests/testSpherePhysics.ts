import { Cube, keyboard, Sphere, ThirdPersonCamera } from ".."

export default {}

const world = new Sphere()
world.physics = "map-centripetal"
world.scale = 20

const char = new Cube()
char.y = 1500
char.physics = "character"

const cam = new ThirdPersonCamera()
cam.append(char)
cam.mouseControl = "drag"

keyboard.onKeyPress = () => {
    char.moveForward(-5)
}