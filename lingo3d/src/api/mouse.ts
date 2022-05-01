import Events from "@lincode/events"
import { container, containerBounds } from "../engine/renderLoop/renderSetup"
import { getSelection } from "../states/useSelection"
import clientToWorld from "../display/utils/clientToWorld"
import { Group } from "three"
import IMouse, { mouseDefaults, MouseEventPayload, mouseSchema } from "../interface/IMouse"
import EventLoopItem from "./core/EventLoopItem"
import { throttle } from "@lincode/utils"
import { getPointerLockCamera } from "../states/usePointLockCamera"
import { getMobile } from "../states/useMobile"
import { createEffect } from "@lincode/reactivity"
import { getCamera } from "../states/useCamera"
import mainCamera from "../engine/mainCamera"
import { loop } from "../engine/eventLoop"
import { getSelectionBlockMouse } from "../states/useSelectionBlockMouse"
import { appendableRoot } from "./core/Appendable"

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
mouseEvents.on("up", (e) => {
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

const computeMouse = throttle((ev: MouseEvent | TouchEvent) => {
    const pos = "targetTouches" in ev ? ev.targetTouches[0] : ev
    if (!pos)
        return { x: 0, y: 0, clientX: 0, clientY: 0, xNorm: 0, yNorm: 0 }

    const rect = containerBounds[0]
    const clientX = pos.clientX - rect.x
    const clientY = pos.clientY - rect.y

    if (getPointerLockCamera())
        return { x: 0, y: 0, clientX, clientY, xNorm: 0, yNorm: 0 }

    const [x, y] = clientToWorld(clientX, clientY)
    const xNorm = (clientX / rect.width) * 2 - 1
    const yNorm = -(clientY / rect.height) * 2 + 1

    return { x, y, clientX, clientY, xNorm, yNorm }
    
}, 0, "leading")

const makeMouseEvent = (names: Array<MouseEventName>) => (ev: MouseEvent | TouchEvent) => {
    const mouseData = computeMouse(ev)
    for (const name of names)
        mouseEvents.emit(name, mouseData)
}

createEffect(() => {
    const handleDown = makeMouseEvent(["down"])
    const handleUp = makeMouseEvent(["up"])

    if (getSelection() && getCamera() === mainCamera && getSelectionBlockMouse()) {
        if (getMobile()) {
            container.addEventListener("touchstart", handleDown)
            container.addEventListener("touchend", handleUp)
    
            return () => {
                container.removeEventListener("touchstart", handleDown)
                container.removeEventListener("touchend", handleUp)
            }
        }
        container.addEventListener("mousedown", handleDown)
        container.addEventListener("mouseup", handleUp)
    
        return () => {
            container.removeEventListener("mousedown", handleDown)
            container.removeEventListener("mouseup", handleUp)
        }
    }
    
    if (getMobile()) {
        const handleTouchMove = makeMouseEvent(["move"])
        const handleTouchStart = makeMouseEvent(["down", "move"])
        const handleTouchEnd = makeMouseEvent(["up", "move"])

        document.addEventListener("touchmove", handleTouchMove)
        container.addEventListener("touchstart", handleTouchStart)
        container.addEventListener("touchend", handleTouchEnd)

        return () => {
            document.removeEventListener("touchmove", handleTouchMove)
            container.removeEventListener("touchstart", handleTouchStart)
            container.removeEventListener("touchend", handleTouchEnd)
        }
    }
    const handleMouseMove = makeMouseEvent(["move"])

    document.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mousedown", handleDown)
    container.addEventListener("mouseup", handleUp)

    return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mousedown", handleDown)
        container.removeEventListener("mouseup", handleUp)
    }
}, [getMobile, getSelection, getCamera, getSelectionBlockMouse])

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