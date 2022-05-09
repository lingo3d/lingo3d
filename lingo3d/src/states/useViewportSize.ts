import store from "@lincode/reactivity"
import { HEIGHT, WIDTH } from "../globals"

const [_setViewportSize, getViewportSize] = store<[number, number]>([WIDTH, HEIGHT])
export { getViewportSize }

export const setViewportSize = ([w, h]: [number, number]) => _setViewportSize([Math.max(w, 1), Math.max(h, 1)])