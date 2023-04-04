import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Clock } from "three"
import { getRenderer } from "../states/useRenderer"
import { getFps } from "../states/useFps"
import { getFirstLoad } from "../states/useFirstLoad"
import { getFirstLoadBeforeRender } from "../states/useFirstLoadBeforeRender"
import { STANDARD_FRAME } from "../globals"
import { getWorldPlayComputed } from "../states/useWorldPlayComputed"
import { onAfterRender } from "../events/onAfterRender"
import { dtPtr } from "../pointers/dtPtr"
import { fpsRatioPtr } from "../pointers/fpsRatioPtr"
import { fpsPtr } from "../pointers/fpsPtr"

let firstRender = false
const handle = onAfterRender(() => {
    firstRender = true
    handle.cancel()
})

let play = true
getWorldPlayComputed((val) => (play = val))

export const timer = (
    time: number,
    repeat: number,
    cb: () => void,
    editor?: boolean
) => {
    let count = 0
    const handle = setInterval(() => {
        if (!play && !editor) return
        cb()
        if (repeat !== -1 && ++count >= repeat) clearInterval(handle)
    }, time)
    return new Cancellable(() => clearInterval(handle))
}

const callbacks = new Set<() => void>()

const clock = new Clock()
let delta = 0

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer || (getFirstLoadBeforeRender() && !getFirstLoad())) return

    const targetDelta = (1 / fpsPtr[0]) * 0.9

    renderer.setAnimationLoop(() => {
        delta += clock.getDelta()
        if (delta > 0.2) delta = 0
        if (delta < targetDelta) return
        fpsRatioPtr[0] = delta * STANDARD_FRAME
        dtPtr[0] = delta
        delta = 0
        for (const cb of callbacks) cb()
    })
}, [getFps, getRenderer, getFirstLoad, getFirstLoadBeforeRender])

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}
