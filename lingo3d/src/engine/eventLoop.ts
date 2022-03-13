import { Cancellable } from "@lincode/promiselikes"
import { getPaused } from "../states/usePaused"

let notPaused = false
getPaused(paused => notPaused = !paused)

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
let fpsReady = false
let fpsRatio = Infinity

const getFPSLoop = (time: number) => {
    if (fpsSamples.length === 60) {
        fpsSamples.sort((a, b) => a - b)
        const fps = fpsSamples[Math.round(fpsSamples.length / 2)]
        fpsRatio = Math.round(fps / 60)
        fpsReady = true
        return
    }

    requestAnimationFrame(getFPSLoop)
    timeOld !== -1 && fpsSamples.push(1000 / (time - timeOld))
    timeOld = time
}
requestAnimationFrame(getFPSLoop)

export const loop = (cb: () => void) => {
    let loopid: number | undefined
    let counter = 0

    const repeat = () => {
        loopid = requestAnimationFrame(repeat)

        if (++counter < fpsRatio) return
        counter = 0
        
        notPaused && cb()
    }
    loopid = requestAnimationFrame(repeat)

    return new Cancellable(() => loopid !== undefined && cancelAnimationFrame(loopid))
}