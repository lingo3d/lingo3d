import store from "@lincode/reactivity"
import { DEFAULT_FPS } from "../globals"

export const [setFps, getFps] = store(DEFAULT_FPS)
