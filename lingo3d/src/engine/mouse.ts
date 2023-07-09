import { emitMouseClick } from "../events/onMouseClick"
import { onMouseDown, emitMouseDown } from "../events/onMouseDown"
import { emitMouseMove } from "../events/onMouseMove"
import {
    emitMouseRightClick,
    onMouseRightClick
} from "../events/onMouseRightClick"
import { onMouseUp, emitMouseUp } from "../events/onMouseUp"
import { container } from "./renderLoop/containers"
import { rightClickPtr } from "../pointers/rightClickPtr"
import pointerToWorld from "../throttle/pointerToWorld"
import { CLICK_TIME } from "../globals"
import Point from "../math/Point"

let downTime = 0
let downX = 0
let downY = 0
let rightClick = false

container.addEventListener("contextmenu", () => (rightClick = true))

onMouseDown((e) => {
    downTime = Date.now()
    downX = e.x
    downY = e.y
})
onMouseUp((e) => {
    const upTime = Date.now()

    const deltaTime = upTime - downTime
    const deltaX = Math.abs(e.x - downX)
    const deltaY = Math.abs(e.y - downY)

    downTime = upTime
    downX = e.x
    downY = e.y

    if (deltaTime < CLICK_TIME && deltaX < 5 && deltaY < 5)
        rightClick ? emitMouseRightClick(e) : emitMouseClick(e)

    rightClick = false
})

container.addEventListener("pointermove", (ev) =>
    emitMouseMove(pointerToWorld(ev))
)
let down = false
container.addEventListener("pointerdown", (ev) => {
    down = true
    const payload = pointerToWorld(ev)
    emitMouseDown(payload)
    emitMouseMove(payload)
})
const handleUp = (ev: PointerEvent) => {
    down && emitMouseUp(pointerToWorld(ev))
    down = false
}
container.addEventListener("pointerup", handleUp)
container.addEventListener("pointercancel", handleUp)
container.addEventListener("pointerleave", handleUp)

export const toggleRightClick = (x: number, y: number) => {
    rightClickPtr[0] = new Point(x, y)
    setTimeout(() => (rightClickPtr[0] = undefined), CLICK_TIME)
}
onMouseRightClick((e) => toggleRightClick(e.clientX, e.clientY))
