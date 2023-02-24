import { setAssetsPath } from "../api/assetsPath"
import Dummy from "../display/Dummy"
import Joystick from "../ui/Joystick"
import MathNode from "../visualScripting/MathNode"

// const dummy = new Dummy()

const joystick = new Joystick()

const mathnode = new MathNode()
mathnode.expression = "sin(x) + cos(y)"