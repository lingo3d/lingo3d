import {
    ThirdPersonCamera,
    Dummy,
    Reflector,
    keyboard,
    settings,
    mouse,
    Line,
    Joystick,
    Cube
} from ".."

settings.grid = true

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
// reflector.roughnessMap = "roughness.png"
// reflector.normalMap = "normal.jpg"
// reflector.roughness = 5

const dummy = new Dummy()
dummy.y = 170 * 0.5
dummy.physics = "character"
dummy.strideMove = true
// dummy.strideMode = "free"
// dummy.animation = ["running", "runningBackwards", "jumping", "death"]

const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.active = true
cam.transition = true
cam.mouseControl = true
cam.lockTargetRotation = "dynamic-lock"
cam.innerX = 50
cam.innerY = 50

keyboard.onKeyPress = (e) => {
    if (e.keys.has("w")) dummy.strideForward = -5
    else if (e.keys.has("s")) dummy.strideForward = 5
    else dummy.strideForward = 0

    if (e.keys.has("a")) dummy.strideRight = 5
    else if (e.keys.has("d")) dummy.strideRight = -5
    else dummy.strideRight = 0

    if (e.keys.has("Space")) dummy.jump(10)
}
