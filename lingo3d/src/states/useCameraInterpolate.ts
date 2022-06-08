import store, { createEffect } from "@lincode/reactivity"
import { Quaternion, Vector3 } from "three"
import { quaternion, vector3 } from "../display/utils/reusables"
import { loop } from "../engine/eventLoop"
import interpolationCamera from "../engine/interpolationCamera"
import { getCamera } from "./useCamera"
import { getCameraFrom } from "./useCameraFrom"

export const [setCameraInterpolate, getCameraInterpolate] = store(false)

createEffect(() => {
    const interpolate = getCameraInterpolate()
    const cameraFrom = getCameraFrom()
    const camera = getCamera()
    if (!interpolate || !cameraFrom || cameraFrom === camera) return

    // interpolationCamera.position.copy(cameraFrom.getWorldPosition(vector3))
    // interpolationCamera.quaternion.copy(cameraFrom.getWorldQuaternion(quaternion))

    // const positionTo = camera.getWorldPosition(new Vector3())
    // const quaternionTo = camera.getWorldQuaternion(new Quaternion())

    // let alpha = 0
    // const handle = loop(() => {
    //     console.log(alpha)
    //     interpolationCamera.position.lerp(positionTo, alpha)
    //     interpolationCamera.quaternion.slerp(quaternionTo, alpha)

    //     alpha = (1 - alpha) * 0.1 + alpha
    //     alpha > 0.999 && setCameraInterpolate(false)
    // })
    // return () => {
    //     handle.cancel()
    // }
}, [getCameraInterpolate, getCameraFrom, getCamera])