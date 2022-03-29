import store from "@lincode/reactivity"
import { HEIGHT, WIDTH } from "../globals"

export const [setResolution, getResolution] = store<[number, number]>([WIDTH, HEIGHT])