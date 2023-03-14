import settings from "../api/settings"
import Dummy from "../display/Dummy"
import Joystick from "../ui/Joystick"
import SpawnNode from "../visualScripting/SpawnNode"

const dummy = new Dummy()
dummy.roughnessFactor = 0.4
dummy.metalnessFactor = 1.5
dummy.envFactor = 1.5
dummy.scale = 5

settings.environment = "studio"
settings.defaultLight = false

dummy.onLoop = (dt) => {
    console.log(dt)
}
