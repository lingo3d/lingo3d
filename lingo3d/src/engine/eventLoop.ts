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
import { mapRange } from "@lincode/math"
import toFixed from "../api/serializer/toFixed"

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

    const ratio = mapRange(fpsPtr[0], 0, 60, 0, 1)
    let pixelRatio = 1

    rendererPtr[0].setAnimationLoop(() => {
        delta += clock.getDelta()
        if (delta > 0.2) delta = 0
        if (delta < targetDeltaAdjusted) return
        fpsRatioPtr[0] = delta * STANDARD_FRAME
        dtPtr[0] = delta
        delta = 0

        const coeff = 1 / (fpsRatioPtr[0] * ratio)
        if (coeff < pixelRatio) pixelRatio = coeff
        else pixelRatio += 0.01
        if (pixelRatio < 0.5) pixelRatio = 0.5
        else if (pixelRatio > 1) pixelRatio = 1
        rendererPtr[0].setPixelRatio(toFixed(pixelRatio, 1))

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
