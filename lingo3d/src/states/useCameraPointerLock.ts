import store from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import { cameraPointerLockPtr } from "../pointers/cameraPointerLockPtr"

export const [setCameraPointerLock, getCameraPointerLock] = store<
    PerspectiveCamera | undefined
>(undefined)

getCameraPointerLock((camera) => (cameraPointerLockPtr[0] = camera))
