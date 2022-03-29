import store from "@lincode/reactivity"
import { HEIGHT, WIDTH } from "../globals"

export const [setViewportSize, getViewportSize] = store<[number, number]>([WIDTH, HEIGHT])