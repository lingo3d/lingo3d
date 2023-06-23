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
import math from "../math"
import toFixed from "../api/serializer/toFixed"
import { resolutionPtr } from "../pointers/resolutionPtr"
import { setPixelRatio } from "../states/usePixelRatio"

const callbacks = new Set<() => void>()

const clock = new Clock()
let delta = 0

const clampPixelRatio = (pixelCount: number, pixelRatio: number) => {
    const clampMin = math.mapRange(pixelCount, 200000, 2000000, 0.75, 0.5, true)
    return toFixed(math.clamp(pixelRatio, clampMin, 1), 1)
}

const pixelCountLowestRatioMap = new Map<number, number>()

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
    let pixelRatioOld: number

    rendererPtr[0].setAnimationLoop(() => {
        delta += clock.getDelta()
        if (delta > 0.2) delta = 0
        if (delta < targetDeltaAdjusted) return
        fpsRatioPtr[0] = delta * STANDARD_FRAME
        dtPtr[0] = delta
        delta = 0

        const pixelCount = resolutionPtr[0][0] * resolutionPtr[0][1]
        const targetPixelRatio = clampPixelRatio(
            pixelCount,
            1 / (fpsRatioPtr[0] * ratio)
        )
        let pixelRatio = pixelCountLowestRatioMap.get(pixelCount) ?? Infinity
        if (targetPixelRatio < pixelRatio) {
            pixelRatio = targetPixelRatio
            pixelCountLowestRatioMap.set(pixelCount, pixelRatio)
        }
        if (pixelRatio !== pixelRatioOld) {
            pixelRatioOld = pixelRatio
            rendererPtr[0].setPixelRatio(pixelRatio)
            setPixelRatio(pixelRatio)
            console.log(pixelRatio)
        }
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
