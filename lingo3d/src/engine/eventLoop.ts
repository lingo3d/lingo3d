import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { Clock } from "three"
import { getRenderer } from "../states/useRenderer"
import { getFps } from "../states/useFps"
import { STANDARD_FRAME } from "../globals"
import { dtPtr } from "../pointers/dtPtr"
import { fpsRatioPtr } from "../pointers/fpsRatioPtr"
import { fpsPtr } from "../pointers/fpsPtr"
import { rendererPtr } from "../pointers/rendererPtr"
import { getTabPaused } from "../states/useTabPaused"
import { getWorldPlay } from "../states/useWorldPlay"
import { worldPlayPtr } from "../pointers/worldPlayPtr"

const callbacks = new Set<() => void>()

const clock = new Clock()
let delta = 0

createEffect(() => {
    if (
        worldPlayPtr[0] === "script" ||
        worldPlayPtr[0] === "runtime" ||
        getTabPaused()
    )
        return

    const targetDelta = (1 / fpsPtr[0]) * 0.9

    rendererPtr[0].setAnimationLoop(() => {
        delta += clock.getDelta()
        if (delta > 0.2) delta = 0
        if (delta < targetDelta) return
        fpsRatioPtr[0] = delta * STANDARD_FRAME
        dtPtr[0] = delta
        delta = 0
        for (const cb of callbacks) cb()
    })
    return () => {
        rendererPtr[0].setAnimationLoop(null)
    }
}, [getFps, getRenderer, getWorldPlay, getTabPaused])

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}
