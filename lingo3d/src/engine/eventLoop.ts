import { Cancellable } from "@lincode/promiselikes"
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

const callbacks = new Set<() => void>()

let prevTime = Date.now()
let count = 0

getRenderer(renderer => {
    renderer.setAnimationLoop(() => {
        const time = Date.now()
        const fps = 1000 / (time - prevTime)
        prevTime = time

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