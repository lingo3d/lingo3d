import Events from "@lincode/events"
import IMouse, {
    LingoMouseEvent,
    mouseDefaults,
    mouseSchema,
    SimpleMouseEvent
} from "../interface/IMouse"
import { throttle } from "@lincode/utils"
import pointerToWorld from "../display/utils/pointerToWorld"
import store from "@lincode/reactivity"
import Nullable from "../interface/utils/Nullable"
import { onBeforeRender } from "../events/onBeforeRender"
import { getWorldPlayComputed } from "../states/useWorldPlayComputed"
import Appendable from "./core/Appendable"
import { Point } from "@lincode/math"
import { container } from "../engine/renderLoop/containers"
import { appendableRoot } from "../collections/appendableRoot"

export type MouseEventName = "click" | "rightClick" | "move" | "down" | "up"
export const mouseEvents = new Events<LingoMouseEvent, MouseEventName>()

let downTime = 0
let downX = 0
let downY = 0
let rightClick = false

container.addEventListener("contextmenu", () => (rightClick = true))

mouseEvents.on("down", (e) => {
    downTime = Date.now()
    downX = e.x
    downY = e.y
})
mouseEvents.on("up", (e) => {
    const upTime = Date.now()

    const deltaTime = upTime - downTime
    const deltaX = Math.abs(e.x - downX)
    const deltaY = Math.abs(e.y - downY)

    downTime = upTime
    downX = e.x
    downY = e.y

    if (deltaTime < 300 && deltaX < 5 && deltaY < 5)
        mouseEvents.emit(rightClick ? "rightClick" : "click", e)

    rightClick = false
})

const computeMouse = throttle(pointerToWorld, 0, "leading")

container.addEventListener("pointermove", (ev) => {
    mouseEvents.emit("move", computeMouse(ev))
})
let down = false
container.addEventListener("pointerdown", (ev) => {
    down = true
    const payload = computeMouse(ev)
    mouseEvents.emit("down", payload)
    mouseEvents.emit("move", payload)
})
const handleUp = (ev: PointerEvent) => {
    down && mouseEvents.emit("up", computeMouse(ev))
    down = false
}
container.addEventListener("pointerup", handleUp)
container.addEventListener("pointercancel", handleUp)
container.addEventListener("pointerleave", handleUp)

export class Mouse extends Appendable implements IMouse {
    public static componentName = "mouse"
    public static defaults = mouseDefaults
    public static schema = mouseSchema

    public onClick: Nullable<(e: SimpleMouseEvent) => void>
    public onRightClick: Nullable<(e: SimpleMouseEvent) => void>
    public onMouseMove: Nullable<(e: SimpleMouseEvent) => void>
    public onMouseDown: Nullable<(e: SimpleMouseEvent) => void>
    public onMouseUp: Nullable<(e: SimpleMouseEvent) => void>
    public onMousePress: Nullable<(e: SimpleMouseEvent) => void>

    public constructor() {
        super()

        let currentPayload = new SimpleMouseEvent(0, 0, 0, 0)
        const [setDown, getDown] = store(false)

        this.createEffect(() => {
            const { onMousePress } = this
            if (!getDown() || !onMousePress) return

            const handle = onBeforeRender(() => onMousePress(currentPayload))

            return () => {
                handle.cancel()
            }
        }, [getDown])

        this.createEffect(() => {
            if (!getWorldPlayComputed()) return

            const handle0 = mouseEvents.on("move", (e) => {
                this.onMouseMove?.(e)
                currentPayload = e
            })
            const handle1 = mouseEvents.on("click", (e) => {
                this.onClick?.(e)
                currentPayload = e
            })
            const handle2 = mouseEvents.on("rightClick", (e) => {
                this.onRightClick?.(e)
                currentPayload = e
            })
            const handle3 = mouseEvents.on("down", (e) => {
                this.onMouseDown?.(e)
                currentPayload = e
                setDown(true)
            })
            const handle4 = mouseEvents.on("up", (e) => {
                this.onMouseUp?.(e)
                currentPayload = e
                setDown(false)
            })

            return () => {
                handle0.cancel()
                handle1.cancel()
                handle2.cancel()
                handle3.cancel()
                handle4.cancel()
            }
        }, [getWorldPlayComputed])
    }
}

const mouse = new Mouse()
appendableRoot.delete(mouse)

export default mouse

export const rightClickPtr: [Point | undefined] = [undefined]
export const toggleRightClickPtr = (x: number, y: number) => {
    rightClickPtr[0] = new Point(x, y)
    setTimeout(() => (rightClickPtr[0] = undefined), 10)
}
mouseEvents.on("rightClick", (e) => toggleRightClickPtr(e.clientX, e.clientY))
