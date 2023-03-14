import store from "@lincode/reactivity"
import { INVERSE_STANDARD_FRAME, STANDARD_FRAME } from "../globals"

export const [setFps, getFps] = store(STANDARD_FRAME)

export const inverseFpsPtr = [INVERSE_STANDARD_FRAME]
export const fpsPtr = [STANDARD_FRAME]

getFps((val) => {
    inverseFpsPtr[0] = 1 / val
    fpsPtr[0] = val
})
