import { setAssetsPath } from "../api/assetsPath"
import Dummy from "../display/Dummy"
import Joystick from "../ui/Joystick"
import MathNode from "../visualScripting/MathNode"

setAssetsPath("assets")

// const dummy = new Dummy()

const joystick = new Joystick()

const mathnode = new MathNode()
mathnode.expression = "1--1"