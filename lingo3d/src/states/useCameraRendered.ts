import store, { createEffect } from "@lincode/reactivity"
import { PerspectiveCamera, Quaternion, Vector3 } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { last } from "@lincode/utils"
import { onBeforeRender } from "../events/onBeforeRender"
import { getCameraFrom } from "./useCameraFrom"

export const [setCameraRendered, getCameraRendered] = store<PerspectiveCamera>(mainCamera)

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

createEffect(() => {
    const cameraFrom = getCameraRendered() === interpolationCamera ? interpolationCamera : getCameraFrom()
    const cameraTo = last(getCameraStack())!
    if (!cameraTo.userData.transition || !cameraFrom || cameraFrom === cameraTo) {
        setCameraRendered(cameraTo)
        return
    }

    const positionFrom = cameraFrom.getWorldPosition(new Vector3())
    const quaternionFrom = cameraFrom.getWorldQuaternion(new Quaternion())

    interpolationCamera.zoom = cameraFrom.zoom
    interpolationCamera.fov = cameraFrom.fov
    interpolationCamera.updateProjectionMatrix()

    let alpha = 0
    const handle = onBeforeRender(() => {
        const positionTo = cameraTo.getWorldPosition(new Vector3())
        const quaternionTo = cameraTo.getWorldQuaternion(new Quaternion())

        interpolationCamera.position.lerpVectors(positionFrom, positionTo, alpha)
        interpolationCamera.quaternion.slerpQuaternions(quaternionFrom, quaternionTo, alpha)

        interpolationCamera.zoom = lerp(cameraFrom.zoom, cameraTo.zoom, alpha)
        interpolationCamera.fov = lerp(cameraFrom.fov, cameraTo.fov, alpha)
        interpolationCamera.updateProjectionMatrix()

        alpha = (1 - alpha) * 0.1 + alpha
        if (alpha < 0.999) return

        setCameraRendered(cameraTo)
        handle.cancel()
    })
    setCameraRendered(cameraTo)
    queueMicrotask(() => !handle.done && setCameraRendered(interpolationCamera))

    return () => {
        handle.cancel()
    }
}, [getCameraFrom, getCameraStack])