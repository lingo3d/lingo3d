import store, { push, pull } from "@lincode/reactivity"
import { Camera } from "three"

const [setCameraList, getCameraList] = store<Array<Camera>>([])
export { getCameraList }

export const pushCameraList = push(setCameraList, getCameraList)
export const pullCameraList = pull(setCameraList, getCameraList)