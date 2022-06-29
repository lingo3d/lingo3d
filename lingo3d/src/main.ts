import index, { settings } from "."
import test from "./tests/testDummy"
import { preventTreeShake } from "@lincode/utils"
import LingoEditor from "./editor"
import Joystick from "./ui/Joystick"

preventTreeShake([index, test])

// settings.autoMount = true

const editor = new LingoEditor()

const joystick = new Joystick()
joystick.onMove = (e) => {
    console.log("x is", e.x)
    console.log("y is", e.y)
}