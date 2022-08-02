import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"

export const [setCameraPointerLock, getCameraPointerLock] = store<
    PerspectiveCamera | undefined
>(undefined)
