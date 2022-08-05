import store, { push, pull } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"

export const [setCameraList, getCameraList] = store<Array<PerspectiveCamera>>(
    []
)

export const pushCameraList = push(setCameraList, getCameraList)
export const pullCameraList = pull(setCameraList, getCameraList)
