import store, { createEffect } from "@lincode/reactivity"
import { Camera, OrthographicCamera, PerspectiveCamera } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import mainCamera from "../engine/mainCamera"
import { getCameraStack } from "./useCameraStack"
import { last } from "@lincode/utils"
import { onBeforeRender } from "../events/onBeforeRender"
import { getCameraFrom } from "./useCameraFrom"
import { getResolution } from "./useResolution"
import { getVR } from "./useVR"
import { ORTHOGRAPHIC_FRUSTUM } from "../globals"
import getWorldPosition from "../display/utils/getWorldPosition"
import getWorldQuaternion from "../display/utils/getWorldQuaternion"

export const [setCameraRendered, getCameraRendered] = store<PerspectiveCamera>(mainCamera)

export const updateCameraAspect = (camera: Camera) => {
    const [resX, resY] = getResolution()
    const aspect = resX / resY

    if (camera instanceof PerspectiveCamera && !getVR()) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    }
    else if (camera instanceof OrthographicCamera) {
        [camera.left, camera.right, camera.top, camera.bottom] = [
            aspect * ORTHOGRAPHIC_FRUSTUM * -0.5,
            aspect * ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * -0.5
        ]
        camera.updateProjectionMatrix()
    }

    return [resX, resY, aspect]
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

createEffect(() => {
    const cameraFrom = getCameraRendered() === interpolationCamera ? interpolationCamera : getCameraFrom()
    const cameraTo = last(getCameraStack())!
    const transition = cameraTo.userData.transition
    if (!cameraFrom || !transition || cameraFrom === cameraTo) {
        setCameraRendered(cameraTo)
        return
    }
    setCameraRendered(interpolationCamera)

    const positionFrom = getWorldPosition(cameraFrom)
    const quaternionFrom = getWorldQuaternion(cameraFrom)

    interpolationCamera.zoom = cameraFrom.zoom
    interpolationCamera.fov = cameraFrom.fov
    updateCameraAspect(interpolationCamera)

    let alpha = 0
    const diffMax = typeof transition === "number" ? transition : Infinity
    const handle = onBeforeRender(() => {
        const positionTo = getWorldPosition(cameraTo)
        const quaternionTo = getWorldQuaternion(cameraTo)

        interpolationCamera.position.lerpVectors(positionFrom, positionTo, alpha)
        interpolationCamera.quaternion.slerpQuaternions(quaternionFrom, quaternionTo, alpha)

        interpolationCamera.zoom = lerp(cameraFrom.zoom, cameraTo.zoom, alpha)
        interpolationCamera.fov = lerp(cameraFrom.fov, cameraTo.fov, alpha)
        interpolationCamera.updateProjectionMatrix()

        alpha = Math.min((1 - alpha) * 0.1, diffMax) + alpha
        if (alpha < 0.999) return

        setCameraRendered(cameraTo)
        updateCameraAspect(cameraTo)
        handle.cancel()
    })
    return () => {
        handle.cancel()
    }
}, [getCameraStack])