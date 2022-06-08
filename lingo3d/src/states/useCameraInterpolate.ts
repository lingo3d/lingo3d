import store, { createEffect } from "@lincode/reactivity"
import { getCamera } from "./useCamera"
import { getCameraFrom } from "./useCameraFrom"

export const [setCameraInterpolate, getCameraInterpolate] = store(false)

createEffect(() => {
    const interpolate = getCameraInterpolate()
    const cameraFrom = getCameraFrom()
    const camera = getCamera()
    if (!interpolate || !cameraFrom) return

    console.log(cameraFrom)

}, [getCameraInterpolate, getCameraFrom, getCamera])