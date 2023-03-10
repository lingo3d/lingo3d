import { handleStopPropagation } from "../../engine/hotkeys"
import { DEBUG } from "../../globals"

const stop = (e: Event) => e.stopPropagation()
const stopPrevent = (e: Event) => {
    e.stopPropagation()
    e.preventDefault()
}

export const stopPropagation = (el: HTMLElement | SVGSVGElement | null) => {
    if (!el) return
    el.addEventListener("mousedown", handleStopPropagation)
    el.addEventListener("click", stop)
    !DEBUG && el.addEventListener("contextmenu", stopPrevent)
    el.addEventListener("pointerdown", stop)
    el.addEventListener("touchstart", stop)
    el.addEventListener("keydown", stop)
}
