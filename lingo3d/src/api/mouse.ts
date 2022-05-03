import Events from "@lincode/events"
import { container, containerBounds } from "../engine/renderLoop/renderSetup"
import { getSelection } from "../states/useSelection"
import clientToWorld from "../display/utils/clientToWorld"
import { Group } from "three"
import IMouse, { mouseDefaults, MouseEventPayload, mouseSchema } from "../interface/IMouse"
import EventLoopItem from "./core/EventLoopItem"
import { throttle } from "@lincode/utils"
import { getCamera } from "../states/useCamera"
import mainCamera from "../engine/mainCamera"
import { loop } from "../engine/eventLoop"
import { getSelectionBlockMouse } from "../states/useSelectionBlockMouse"
import { appendableRoot } from "./core/Appendable"
import { getPickingMode } from "../states/usePickingMode"

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

const computeMouse = throttle((ev: PointerEvent) => {
    const rect = containerBounds[0]
    const clientX = ev.clientX - rect.x
    const clientY = ev.clientY - rect.y

    if (getPickingMode() === "camera")
        return { x: 0, y: 0, clientX, clientY, xNorm: 0, yNorm: 0 }

    const [x, y] = clientToWorld(clientX, clientY)
    const xNorm = (clientX / rect.width) * 2 - 1
    const yNorm = -(clientY / rect.height) * 2 + 1

    return { x, y, clientX, clientY, xNorm, yNorm }
    
}, 0, "leading")

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
    public x = 0
    public y = 0
    public clientX = 0
    public clientY = 0

    public constructor() {
        super(new Group())

        this.createEffect(() => {
            if (getSelection() && getCamera() === mainCamera && getSelectionBlockMouse()) return

            let currentPayload: MouseEventPayload = { x: 0, y: 0, clientX: 0, clientY: 0, xNorm: 0, yNorm: 0 }

            const handle0 = mouseEvents.on("move", e => {
                this.x = e.x
                this.y = e.y
                this.clientX = e.clientX
                this.clientY = e.clientY
                this.onMouseMove?.(e)
                currentPayload = e
            })
            const handle1 = mouseEvents.on("click", e => {
                this.onClick?.(e)
                currentPayload = e
            })
            
            let isDown = false
            
            const handle2 = mouseEvents.on("down", e => {
                this.onMouseDown?.(e)
                isDown = true
                currentPayload = e
            })
            const handle3 = mouseEvents.on("up", e => {
                this.onMouseUp?.(e)
                isDown = false
                currentPayload = e
            })
            
            const handle4 = loop(() => isDown && this.onMousePress?.(currentPayload))

            return () => {
                handle0.cancel()
                handle1.cancel()
                handle2.cancel()
                handle3.cancel()
                handle4.cancel()
            }
        }, [getSelection, getCamera, getSelectionBlockMouse])
    }
}

const mouse = new Mouse()
appendableRoot.delete(mouse)

export default mouse