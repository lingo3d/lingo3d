import { WebGLRenderer } from "three"
import createSystem from "./utils/createSystem"
import math from "../math"
import toFixed from "../api/serializer/toFixed"
import { fpsRatioPtr } from "../pointers/fpsRatioPtr"
import { rendererPtr } from "../pointers/rendererPtr"
import { resolutionPtr } from "../pointers/resolutionPtr"
import { getPixelRatio, setPixelRatio } from "../states/usePixelRatio"
import { fpsPtr } from "../pointers/fpsPtr"
import { STANDARD_FRAME } from "../globals"

const clampPixelRatio = (pixelCount: number, pixelRatio: number) => {
    const clampMin = math.mapRange(pixelCount, 200000, 2000000, 0.75, 0.5, true)
    return toFixed(math.clamp(pixelRatio, clampMin, 1), 1)
}

const sortPixelRatio = (a: number, b: number) => a - b
const SAMPLES = 10

export const pixelRatioSystem = createSystem("pixelRatioSystem", {
    data: () => ({
        pixelCount: resolutionPtr[0][0] * resolutionPtr[0][1],
        pixelRatio: Infinity,
        ratio: math.mapRange(fpsPtr[0], 0, STANDARD_FRAME, 0, 1),
        pixelRatioArray: [] as Array<number>
    }),
    update: (_: WebGLRenderer, data) => {
        const pixelRatio = 1 / (fpsRatioPtr[0] * data.ratio)
        data.pixelRatioArray.push(clampPixelRatio(data.pixelCount, pixelRatio))
        if (data.pixelRatioArray.length < SAMPLES) return

        data.pixelRatioArray.sort(sortPixelRatio)
        let median = data.pixelRatioArray[Math.floor(SAMPLES * 0.5)]
        data.pixelRatioArray.length = 0

        if (pixelRatio > 1.09) {
            data.pixelRatio += 0.1
            console.log("reevaluate", pixelRatio, data.pixelRatio)
        }

        if (median >= data.pixelRatio || data.pixelRatio - median <= 0.1) return
        data.pixelRatio = median

        if (median === getPixelRatio()) return
        rendererPtr[0].setPixelRatio(median)
        setPixelRatio(median)
        console.log("pixelRatio", median)
    }
})
