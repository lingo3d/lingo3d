import Events from "@lincode/events"
import { container } from "../engine/renderLoop/renderSetup"
import { Group } from "three"
import IMouse, { mouseDefaults, MouseEventPayload, mouseSchema } from "../interface/IMouse"
import EventLoopItem from "./core/EventLoopItem"
import { throttle } from "@lincode/utils"
import { loop } from "../engine/eventLoop"
import { getSelectionBlockMouse } from "../states/useSelectionBlockMouse"
import { appendableRoot } from "./core/Appendable"
import clientToWorld from "../display/utils/clientToWorld"
import store from "@lincode/reactivity"
import { getEditorActive } from "../states/useEditorActive"

export type MouseEventName = "click" | "move" | "down" | "up"
export const mouseEvents = new Events<MouseEventPayload, MouseEventName>()

let downTime = 0
let downX = 0
let downY = 0

mouseEvents.on("down", e => {
    downTime = Date.now()
    downX = e.clientX
    downY = e.clientY
})
mouseEvents.on("up", e => {
    const upTime = Date.now()

    const deltaTime = upTime - downTime
    const deltaX = Math.abs(e.clientX - downX)
    const deltaY = Math.abs(e.clientY - downY)

    downTime = upTime
    downX = e.clientX
    downY = e.clientY

    if (deltaTime < 300 && deltaX < 5 && deltaY < 5)
        mouseEvents.emit("click", e)
})

const computeMouse = throttle(clientToWorld, 0, "leading")

container.addEventListener("pointermove", ev => {
    mouseEvents.emit("move", computeMouse(ev))
})
let down = false
container.addEventListener("pointerdown", ev => {
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

export class Mouse extends EventLoopItem implements IMouse {
    public static componentName = "mouse"
    public static defaults = mouseDefaults
    public static schema = mouseSchema

    public onClick?: (e: MouseEventPayload) => void
    public onMouseMove?: (e: MouseEventPayload) => void
    public onMouseDown?: (e: MouseEventPayload) => void
    public onMouseUp?: (e: MouseEventPayload) => void
    public onMousePress?: (e: MouseEventPayload) => void

    public constructor() {
        super(new Group())

        let currentPayload: MouseEventPayload = { x: 0, y: 0, z: 0, clientX: 0, clientY: 0, xNorm: 0, yNorm: 0 }
        const [setDown, getDown] = store(false)

        this.createEffect(() => {
            const cb = this.onMousePress
            if (!getDown() || !cb) return

            const handle = loop(() => cb(currentPayload))

            return () => {
                handle.cancel()
            }
        }, [getDown])

        this.createEffect(() => {
            if (getEditorActive() && getSelectionBlockMouse()) return

            const handle0 = mouseEvents.on("move", e => {
                this.onMouseMove?.(e)
                currentPayload = e
            })
            const handle1 = mouseEvents.on("click", e => {
                this.onClick?.(e)
                currentPayload = e
            })
            
            const handle2 = mouseEvents.on("down", e => {
                this.onMouseDown?.(e)
                currentPayload = e
                setDown(true)
            })
            const handle3 = mouseEvents.on("up", e => {
                this.onMouseUp?.(e)
                currentPayload = e
                setDown(false)
            })

            return () => {
                handle0.cancel()
                handle1.cancel()
                handle2.cancel()
                handle3.cancel()
            }
        }, [getEditorActive, getSelectionBlockMouse])
    }
}

const mouse = new Mouse()
appendableRoot.delete(mouse)

export default mouse