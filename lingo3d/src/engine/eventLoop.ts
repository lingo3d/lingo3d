import { Cancellable } from "@lincode/promiselikes"
import store, { createEffect } from "@lincode/reactivity"
import { Clock } from "three"
import { getRenderer } from "../states/useRenderer"
import { getFps } from "../states/useFps"
import { getFirstLoad } from "../states/useFirstLoad"
import { getFirstLoadBeforeRender } from "../states/useFirstLoadBeforeRender"
import { emitRenderHalfRate } from "../events/onRenderHalfRate"
import { setPaused } from "../states/usePaused"
import { SEC2FRAME } from "../globals"

let paused = false
const checkPaused = (val?: boolean) =>
    setPaused((paused = val ?? (document.hidden || !document.hasFocus())))

const [setLocked, getLocked] = store(false)
createEffect(() => {
    const locked = getLocked()
    if (locked) return

    const cb0 = () => checkPaused(true)
    const cb1 = () => checkPaused()
    const cb2 = () => {
        checkPaused(false)
        setLocked(true)
        setTimeout(() => setLocked(false), 1000)
    }
    window.addEventListener("blur", cb0)
    window.addEventListener("focus", cb1)
    document.addEventListener("visibilitychange", cb1)
    window.addEventListener("resize", cb2)
    const interval = setInterval(cb1, 1000)
    cb1()

    return () => {
        window.removeEventListener("blur", cb0)
        window.removeEventListener("focus", cb1)
        document.removeEventListener("visibilitychange", cb1)
        window.removeEventListener("resize", cb2)
        clearInterval(interval)
    }
}, [getLocked])

export const timer = (time: number, repeat: number, cb: () => void) => {
    let count = 0
    const handle = setInterval(() => {
        if (paused) return
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

    renderer.setAnimationLoop(() => {
        if (paused) return
        delta += clock.getDelta()
        if (delta < targetDelta) return
        fpsRatio[0] = delta * SEC2FRAME
        dt[0] = delta
        delta = 0
        for (const cb of callbacks) cb()
        if (++renderSlowCount === 2) {
            renderSlowCount = 0
            emitRenderHalfRate()
        }
    })
}, [getFps, getRenderer, getFirstLoad, getFirstLoadBeforeRender])

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}
