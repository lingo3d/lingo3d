import store, { pull, push } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import mainCamera from "../engine/mainCamera"

export const [setCameraStack, getCameraStack] = store<Array<PerspectiveCamera>>(
    [mainCamera]
)
export const pushCameraStack = push(setCameraStack, getCameraStack)
export const pullCameraStack = pull(setCameraStack, getCameraStack)
