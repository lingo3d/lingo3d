import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Clock } from "three"
import { getRenderer } from "../states/useRenderer"
import { getFps } from "../states/useFps"
import { getFirstLoad } from "../states/useFirstLoad"
import { getFirstLoadBeforeRender } from "../states/useFirstLoadBeforeRender"
import { emitRenderSlow } from "../events/onRenderSlow"
import { setPageInactive } from "../states/usePageInactive"

let pageInactive = document.hidden
const checkPageInactive = (val?: boolean) =>
    setPageInactive(
        (pageInactive = val ?? (document.hidden || !document.hasFocus()))
    )
window.addEventListener("blur", () => checkPageInactive(true))
window.addEventListener("focus", () => checkPageInactive())
document.addEventListener("visibilitychange", () => checkPageInactive())
setInterval(() => checkPageInactive(), 1000)

export const timer = (time: number, repeat: number, cb: () => void) => {
    let count = 0
    const handle = setInterval(() => {
        if (pageInactive) return
        cb()
        if (repeat !== -1 && ++count >= repeat) clearInterval(handle)
    }, time)
    return new Cancellable(() => clearInterval(handle))
}

const callbacks = new Set<() => void>()

const clock = new Clock()
let delta = 0

export const fpsRatio = [1]
export const dt = [0]

let renderSlowCount = 0

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer || (getFirstLoadBeforeRender() && !getFirstLoad())) return

    const targetDelta = (1 / getFps()) * 0.9
    const fullDelta = 1 / 60

    renderer.setAnimationLoop(() => {
        if (pageInactive) return
        delta += clock.getDelta()
        if (delta < targetDelta) return
        fpsRatio[0] = delta / fullDelta
        dt[0] = delta
        delta = 0
        for (const cb of callbacks) cb()
        if (++renderSlowCount === 2) {
            renderSlowCount = 0
            emitRenderSlow()
        }
    })
}, [getFps, getRenderer, getFirstLoad, getFirstLoadBeforeRender])

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}
