import store from "@lincode/reactivity"
import { STANDARD_FRAME } from "../globals"

export const [setFps, getFps] = store(STANDARD_FRAME)

export const fpsPtr = [STANDARD_FRAME]
getFps((val) => (fpsPtr[0] = val))
