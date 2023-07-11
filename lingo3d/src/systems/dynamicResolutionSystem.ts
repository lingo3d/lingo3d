import { WebGLRenderer } from "three"
import { fpsRatioPtr } from "../pointers/fpsRatioPtr"
import { rendererPtr } from "../pointers/rendererPtr"
import { setPixelRatio } from "../states/usePixelRatio"
import { fpsPtr } from "../pointers/fpsPtr"
import { STANDARD_FRAME } from "../globals"
import isBusy from "../api/isBusy"
import createInternalSystem from "./utils/createInternalSystem"
import { mapLinear } from "three/src/math/MathUtils"
import toFixed from "../api/serializer/toFixed"

const sortPixelRatio = (a: number, b: number) => a - b
const SAMPLES = 20

export const dynamicResolutionSystem = createInternalSystem(
    "dynamicResolutionSystem",
    {
        data: () => ({
            pixelRatio: Infinity,
            ratio: mapLinear(fpsPtr[0], 0, STANDARD_FRAME, 0, 1),
            pixelRatioArray: [] as Array<number>
        }),
        update: (_: WebGLRenderer, data) => {
            if (isBusy()) return

            data.pixelRatioArray.push(1 / (fpsRatioPtr[0] * data.ratio))
            if (data.pixelRatioArray.length < SAMPLES) return

            data.pixelRatioArray.sort(sortPixelRatio)
            const median = toFixed(
                data.pixelRatioArray[Math.floor(SAMPLES * 0.4)],
                1
            )
            data.pixelRatioArray.length = 0

            if (median >= data.pixelRatio) return
            data.pixelRatio = median

            rendererPtr[0].setPixelRatio(median)
            setPixelRatio(median)
        },
        effect: () => {},
        cleanup: () => {
            rendererPtr[0].setPixelRatio(1)
            setPixelRatio(1)
        }
    }
)
