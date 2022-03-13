import store from "@lincode/reactivity"
import { HEIGHT, WIDTH } from "../globals"

export const [setContainerSize, getContainerSize] = store([WIDTH, HEIGHT])