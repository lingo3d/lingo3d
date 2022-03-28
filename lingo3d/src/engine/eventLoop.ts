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

let timeOld = -1
const fpsSamples: Array<number> = []

const targetFPSRates = [1, 2]
let fpsRate = Infinity

const getFPSLoop = (time: number) => {
    if (fpsSamples.length === 120) {
        fpsSamples.sort((a, b) => a - b)
        const fps = fpsSamples[Math.round(fpsSamples.length * 0.5)]
        const estimatedRate = fps / 60

        let diffMin = Infinity
        for (const rate of targetFPSRates) {
            const diff = Math.abs(estimatedRate - rate)
            if (diff > diffMin) continue
            diffMin = diff
            fpsRate = rate
        }
        return
    }

    requestAnimationFrame(getFPSLoop)
    timeOld !== -1 && fpsSamples.push(1000 / (time - timeOld))
    timeOld = time
}
requestAnimationFrame(getFPSLoop)

const callbacks = new Set<() => void>()
let counter = 0

getRenderer(renderer => {
    renderer.setAnimationLoop(() => {
        if (++counter < fpsRate) return
        counter = 0

        if (getPaused()) return

        for (const cb of callbacks)
            cb()
    })  
})

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}