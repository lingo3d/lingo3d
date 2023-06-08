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
import { getDocumentHidden } from "../states/useDocumentHidden"
import { getWorldPlay } from "../states/useWorldPlay"
import { worldPlayPtr } from "../pointers/worldPlayPtr"
import { dtNormPtr } from "../pointers/dtNormPtr"
import { mapRange } from "@lincode/math"

const callbacks = new Set<() => void>()

const clock = new Clock()
let delta = 0

createEffect(() => {
    if (
        worldPlayPtr[0] === "script" ||
        worldPlayPtr[0] === "runtime" ||
        getDocumentHidden()
    )
        return

    const targetDelta = 1 / fpsPtr[0]
    const targetDeltaAdjusted = targetDelta * 0.9

    rendererPtr[0].setAnimationLoop(() => {
        delta += clock.getDelta()
        if (delta > 0.2) delta = 0
        if (delta < targetDeltaAdjusted) return
        fpsRatioPtr[0] = delta * STANDARD_FRAME
        dtPtr[0] = delta
        dtNormPtr[0] = mapRange(delta, 0, targetDelta, 0, 1)
        delta = 0
        for (const cb of callbacks) cb()
    })
    return () => {
        rendererPtr[0].setAnimationLoop(null)
    }
}, [getFps, getRenderer, getWorldPlay, getDocumentHidden])

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}
