import { WebGLRenderer } from "three"
import createSystem from "./utils/createSystem"
import math from "../math"
import toFixed from "../api/serializer/toFixed"
import { fpsRatioPtr } from "../pointers/fpsRatioPtr"
import { rendererPtr } from "../pointers/rendererPtr"
import { resolutionPtr } from "../pointers/resolutionPtr"
import { setPixelRatio } from "../states/usePixelRatio"

const clampPixelRatio = (pixelCount: number, pixelRatio: number) => {
    const clampMin = math.mapRange(pixelCount, 200000, 2000000, 0.75, 0.5, true)
    return toFixed(math.clamp(pixelRatio, clampMin, 1), 1)
}

const pixelCountLowestRatioMap = new Map<number, number>()

export const pixelRatioSystem = createSystem("pixelRatioSystem", {
    data: {} as { pixelRatio: number; ratio: number },
    update: (_: WebGLRenderer, data) => {
        const pixelCount = resolutionPtr[0][0] * resolutionPtr[0][1]
        const targetPixelRatio = clampPixelRatio(
            pixelCount,
            1 / (fpsRatioPtr[0] * data.ratio)
        )
        let pixelRatio = pixelCountLowestRatioMap.get(pixelCount) ?? Infinity
        if (targetPixelRatio < pixelRatio) {
            pixelRatio = targetPixelRatio
            pixelCountLowestRatioMap.set(pixelCount, pixelRatio)
        }
        if (pixelRatio === data.pixelRatio) return
        data.pixelRatio = pixelRatio
        rendererPtr[0].setPixelRatio(pixelRatio)
        setPixelRatio(pixelRatio)
        console.log(pixelRatio)
    }
})
