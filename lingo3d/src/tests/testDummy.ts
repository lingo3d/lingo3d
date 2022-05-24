
import { ThirdPersonCamera, Dummy, Reflector, keyboard } from ".."
import { setGridHelper } from "../states/useGridHelper"
//@ts-ignore
import roughnessSrc from "../../assets-local/roughness.png"
//@ts-ignore
import normalSrc from "../../assets-local/normal.jpg"
//@ts-ignore
// import cbpunkSrc from "../../assets-local/cbpunk.glb"

export default {}

setGridHelper(true)

const reflector = new Reflector()
reflector.scale = 100
reflector.physics = "map"
reflector.roughnessMap = roughnessSrc
reflector.normalMap = normalSrc
reflector.roughness = 5

const dummy = new Dummy()
dummy.y = 50
dummy.preset = "rifle"
dummy.physics = "character"
dummy.strideMove = true

const cam = new ThirdPersonCamera()
cam.append(dummy)
cam.activate()
cam.mouseControl = true

// const map = new Model()
// map.scale = 200
// map.src = cbpunkSrc
// map.y = 8900
// map.z = 1000
// map.physics = "map"

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