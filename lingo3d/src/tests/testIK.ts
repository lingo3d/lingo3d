import { Camera } from ".."
import OrbitCamera from "../display/cameras/OrbitCamera"
import Dummy from "../display/Dummy"

const player = new Dummy()
player.id = "player"
player.src = "player2.glb"

const player2 = new Dummy()
player2.id = "player"
player2.src = "player2.glb"
player2.x = 100

player2.onLoad = () => {
    const found = player2.find("Wolf3D_Hair")
    if (!found) return
    found.color = "red"
}