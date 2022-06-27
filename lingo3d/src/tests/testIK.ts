import { Camera } from ".."
import OrbitCamera from "../display/cameras/OrbitCamera"
import Dummy from "../display/Dummy"

export default {}

const player = new Dummy()
player.id = "player"
player.src = "player2.glb"

const cam = new Camera()
cam.z = 500
cam.active = true

const cam0 = new OrbitCamera()
cam0.targetId = "player"
cam0.innerZ = 200
cam0.transition = true

player.onClick = () => {
    cam0.activate()
    console.log("player")
}