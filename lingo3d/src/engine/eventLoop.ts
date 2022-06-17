import { Cancellable } from "@lincode/promiselikes"
import clockDelta from "../display/utils/clockDelta"
import { getPaused } from "../states/usePaused"
import { getRenderer } from "../states/useRenderer"

let paused = getPaused()
getPaused(val => paused = val)

export const timer = (time: number, repeat: number, cb: () => void) => {
    let count = 0
    const handle = setInterval(() => {
        if (document.hidden || paused) return
        cb()
        if (repeat !== -1 && ++count >= repeat)
            clearInterval(handle)
    }, time)
    return new Cancellable(() => clearInterval(handle))
}

let count = 0
const callbacks = new Set<() => void>()

getRenderer(renderer => {
    renderer?.setAnimationLoop(() => {
        const fps = 1 / clockDelta[0]

        if (paused || ++count < Math.round(fps / 60)) return
        count = 0

        for (const cb of callbacks)
            cb()
    })  
})

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}