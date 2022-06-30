import settings from "../api/settings"
import Dummy from "../display/Dummy"
import Joystick from "../ui/Joystick"

export default {}
setTimeout(() => settings.defaultOrbitControls = false, 100)

const dummy = new Dummy()

const joystick = new Joystick()

joystick.onMove = e => {
    dummy.strideForward = -e.y
    dummy.strideRight = e.x
}

joystick.onMoveEnd = () => {
    dummy.strideForward = 0
    dummy.strideRight = 0
}