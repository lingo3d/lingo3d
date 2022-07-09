
import { ThirdPersonCamera, Dummy, Reflector, keyboard, settings, mouse, Line } from ".."
import createProxy from "../api/createProxy"

export default {}

settings.gridHelper = true

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

const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.activate()
cam.transition = true
cam.mouseControl = true
// cam.lockTargetRotation = "dynamic-lock"
cam.innerX = 50
cam.innerY = 50

dummy.src = "fox/Fox.fbx"
dummy.animations = {
    idle: "fox/Idle.fbx",
    running: "fox/Walking.fbx",
}

keyboard.onKeyPress = (_, pressed) => {
    if (pressed.has("w"))
        dummy.strideForward = -5
    else if (pressed.has("s"))
        dummy.strideForward = 5
    else
        dummy.strideForward = 0

    if (pressed.has("a"))
        dummy.strideRight = 5
    else if (pressed.has("d"))
        dummy.strideRight = -5
    else
        dummy.strideRight = 0

    if (pressed.has("Space"))
        dummy.jump(10)
}

mouse.onClick = () => {
    const line = new Line()
    line.from = { x: dummy.x, y: dummy.y, z: dummy.z }
    const pt = cam.pointAt(10000)
    line.to = { x: pt.x, y: pt.y, z: pt.z }
    line.bloom = true
}