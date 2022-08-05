import store from "@lincode/reactivity"
import { HEIGHT, WIDTH } from "../globals"

const [_setResolution, getResolution] = store<[number, number]>([WIDTH, HEIGHT])
export { getResolution }

export const setResolution = ([w, h]: [number, number]) =>
    _setResolution([Math.max(w, 1), Math.max(h, 1)])
