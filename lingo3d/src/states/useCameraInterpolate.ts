import store, { createEffect } from "@lincode/reactivity"
import { Quaternion, Vector3 } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import { getCameraStack } from "./useCameraStack"
import { getCameraFrom } from "./useCameraFrom"
import { last } from "@lincode/utils"
import { onBeforeRender } from "../events/onBeforeRender"

export const [setCameraInterpolate, getCameraInterpolate] = store(false)

createEffect(() => {
    const interpolate = getCameraInterpolate()
    const cameraFrom = getCameraFrom()
    const cameraTo = last(getCameraStack())!
    if (!interpolate || !cameraFrom || cameraFrom === cameraTo) return

    const positionFrom = cameraFrom.getWorldPosition(new Vector3())
    const quaternionFrom = cameraFrom.getWorldQuaternion(new Quaternion())

    let alpha = 0
    const handle = onBeforeRender(() => {
        const positionTo = cameraTo.getWorldPosition(new Vector3())
        const quaternionTo = cameraTo.getWorldQuaternion(new Quaternion())

        interpolationCamera.position.lerpVectors(positionFrom, positionTo, alpha)
        interpolationCamera.quaternion.slerpQuaternions(quaternionFrom, quaternionTo, alpha)

        alpha = (1 - alpha) * 0.1 + alpha
        alpha > 0.999 && setCameraInterpolate(false)
    })
    return () => {
        handle.cancel()
    }
}, [getCameraInterpolate, getCameraFrom, getCameraStack])