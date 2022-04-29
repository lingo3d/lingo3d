import { Cancellable } from "@lincode/promiselikes"
import { getPaused } from "../states/usePaused"
import { getRenderer } from "../states/useRenderer"

const interval = (time: number, repeat: number, cb: () => void) => {
    let count = 0
    const handle = setInterval(() => {
        if (document.hidden) return

        cb()
        ++count >= repeat && clearInterval(handle)
    }, time)
    return new Cancellable(() => clearInterval(handle))
}

type Timer = {
    (time: number, cb: () => void): Cancellable
    (time: number, repeat: number, cb: () => void): Cancellable
}

export const timer: Timer = (...args: Array<any>): Cancellable => {
    if (args.length === 2)
        return interval(args[0], 0, args[1])

    if (args.length === 3)
        return interval(args[0], args[1], args[2])

    throw new Error("incorrect number of arguments")
}

const callbacks = new Set<() => void>()

let prevTime = Date.now()
let count = 0

getRenderer(renderer => {
    renderer.setAnimationLoop(() => {
        const time = Date.now()
        const fps = 1000 / (time - prevTime)
        prevTime = time

        if (getPaused() || ++count < Math.round(fps / 60)) return
        count = 0

        for (const cb of callbacks)
            cb()
    })  
})

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}