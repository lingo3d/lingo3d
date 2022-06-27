import { Camera } from ".."
import OrbitCamera from "../display/cameras/OrbitCamera"
import Dummy from "../display/Dummy"

export default {}

const player = new Dummy()
player.id = "player"
// player.src = "player2.glb"
player.preset = "rifle"
player.boxVisible = true

const dummy = new Dummy()
dummy.x = 100
dummy.id = "dummy"
dummy.boxVisible = true

const cam = new Camera()
cam.z = 500
cam.active = true
cam.id = "hello"

const cam0 = new OrbitCamera()
cam0.targetId = "player"
cam0.innerZ = 200
cam0.transition = true

const cam1 = new OrbitCamera()
cam1.targetId = "dummy"
cam1.innerZ = 200
cam1.transition = true

player.onClick = () => {
    cam0.activate()
    console.log("player")
}

dummy.onClick = () => {
    cam1.activate()
}