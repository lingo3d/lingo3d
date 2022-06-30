import settings from "../api/settings"
import Joystick from "../ui/Joystick"

export default {}
setTimeout(() => settings.defaultOrbitControls = false, 100)

const joystick = new Joystick()