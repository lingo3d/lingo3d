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
import { getWorldMode } from "../states/useWorldMode"
import { worldModePtr } from "../pointers/worldModePtr"

const callbacks = new Set<() => void>()

const clock = new Clock()
let delta = 0

createEffect(() => {
    if (worldModePtr[0] === "runtime" || getDocumentHidden()) return

    const [renderer] = rendererPtr
    const targetDelta = 1 / fpsPtr[0]
    const targetDeltaAdjusted = targetDelta * 0.7

    renderer.setAnimationLoop(() => {
        delta += clock.getDelta()
        if (delta > 0.2) delta = 0
        if (fpsPtr[0] === 30 && delta < targetDeltaAdjusted) return
        fpsRatioPtr[0] = delta * STANDARD_FRAME
        dtPtr[0] = delta
        delta = 0

        for (const cb of callbacks) cb()
    })
    return () => {
        renderer.setAnimationLoop(null)
    }
}, [getFps, getRenderer, getWorldMode, getDocumentHidden])

export const loop = (cb: () => void) => {
    callbacks.add(cb)
    return new Cancellable(() => callbacks.delete(cb))
}
