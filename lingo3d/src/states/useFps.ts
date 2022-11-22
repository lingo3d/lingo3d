import store from "@lincode/reactivity"
import { SEC2FRAME } from "../globals"

export const [setFps, getFps] = store(SEC2FRAME)
