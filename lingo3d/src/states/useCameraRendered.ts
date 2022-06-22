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
    const transition = cameraTo.userData.transition ?? cameraFrom?.userData.transition
    if (!cameraFrom || !transition || cameraTo.userData.transition === false || cameraFrom === cameraTo) {
        setCameraRendered(cameraTo)
        return
    }
    setCameraRendered(interpolationCamera)

    const positionFrom = cameraFrom.getWorldPosition(new Vector3())
    const quaternionFrom = cameraFrom.getWorldQuaternion(new Quaternion())

    interpolationCamera.zoom = cameraFrom.zoom
    interpolationCamera.fov = cameraFrom.fov
    interpolationCamera.updateProjectionMatrix()

    let alpha = 0
    const diffMax = typeof transition === "number" ? transition : Infinity
    const handle = onBeforeRender(() => {
        const positionTo = cameraTo.getWorldPosition(new Vector3())
        const quaternionTo = cameraTo.getWorldQuaternion(new Quaternion())

        interpolationCamera.position.lerpVectors(positionFrom, positionTo, alpha)
        interpolationCamera.quaternion.slerpQuaternions(quaternionFrom, quaternionTo, alpha)

        interpolationCamera.zoom = lerp(cameraFrom.zoom, cameraTo.zoom, alpha)
        interpolationCamera.fov = lerp(cameraFrom.fov, cameraTo.fov, alpha)
        interpolationCamera.updateProjectionMatrix()

        alpha = Math.min((1 - alpha) * 0.1, diffMax) + alpha
        if (alpha < 0.999) return

        setCameraRendered(cameraTo)
        handle.cancel()
    })
    return () => {
        handle.cancel()
    }
}, [getCameraFrom, getCameraStack])