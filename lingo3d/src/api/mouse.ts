import Events from "@lincode/events"
import { container } from "../engine/renderLoop/renderSetup"
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
import { getEditorMounted } from "../states/useEditorMounted"
import { getCameraRendered } from "../states/useCameraRendered"
import mainCamera from "../engine/mainCamera"
import { appendableRoot } from "./core/collections"
import { getEditorPlay } from "../states/useEditorPlay"
import Appendable from "./core/Appendable"

export type MouseEventName = "click" | "rightClick" | "move" | "down" | "up"
export const mouseEvents = new Events<LingoMouseEvent, MouseEventName>()

let downTime = 0
let downX = 0
let downY = 0
let rightClick = false

container.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    rightClick = true
})
container.addEventListener("touchstart", (e) => {
    e.preventDefault()
})

mouseEvents.on("down", (e) => {
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

        let currentPayload = { clientX: 0, clientY: 0 }
        const [setDown, getDown] = store(false)

        this.createEffect(() => {
            const cb = this.onMousePress
            if (!getDown() || !cb) return

            const handle = onBeforeRender(() => cb(currentPayload))

            return () => {
                handle.cancel()
            }
        }, [getDown])

        this.createEffect(() => {
            if (
                !getEditorPlay() ||
                (getEditorMounted() && getCameraRendered() === mainCamera)
            )
                return

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
        }, [getEditorPlay, getEditorMounted, getCameraRendered])
    }
}

const mouse = new Mouse()
appendableRoot.delete(mouse)

export default mouse
