import store from "@lincode/reactivity"
import { STANDARD_FRAME } from "../globals"
import { fpsPtr } from "../pointers/fpsPtr"

export const [setFps, getFps] = store<30 | 60>(STANDARD_FRAME)

getFps((val) => (fpsPtr[0] = val))
