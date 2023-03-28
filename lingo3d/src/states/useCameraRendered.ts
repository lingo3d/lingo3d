import store, { createEffect } from "@lincode/reactivity"
import { Camera, OrthographicCamera, PerspectiveCamera } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import mainCamera from "../engine/mainCamera"
import { getResolution } from "./useResolution"
import { ORTHOGRAPHIC_FRUSTUM } from "../globals"
import getWorldPosition from "../display/utils/getWorldPosition"
import getWorldQuaternion from "../display/utils/getWorldQuaternion"
import { getWebXR } from "./useWebXR"
import { getSplitView } from "./useSplitView"
import { getCameraComputed } from "./useCameraComputed"
import {
    addCameraInterpolationSystem,
    deleteCameraInterpolationSystem
} from "../systems/cameraInterpolationSystem"

const [setCameraRendered, getCameraRendered] =
    store<PerspectiveCamera>(mainCamera)
export { getCameraRendered }

export const updateCameraAspect = (camera: Camera) => {
    const [resX, resY] = getResolution()
    const aspect = resX / resY

    if (camera instanceof PerspectiveCamera && !getWebXR()) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    } else if (camera instanceof OrthographicCamera) {
        ;[camera.left, camera.right, camera.top, camera.bottom] = [
            aspect * ORTHOGRAPHIC_FRUSTUM * -0.5,
            aspect * ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * 0.5,
            ORTHOGRAPHIC_FRUSTUM * -0.5
        ]
        camera.updateProjectionMatrix()
    }

    return [resX, resY, aspect]
}

let cameraLast: PerspectiveCamera | undefined

createEffect(() => {
    if (getSplitView()) {
        setCameraRendered(mainCamera)
        return
    }
    const cameraFrom =
        getCameraRendered() === interpolationCamera
            ? interpolationCamera
            : cameraLast

    const cameraTo = (cameraLast = getCameraComputed())
    const transition = cameraTo.userData.transition
    if (
        !cameraFrom ||
        !transition ||
        cameraFrom === cameraTo ||
        cameraFrom === mainCamera ||
        cameraTo === mainCamera
    ) {
        setCameraRendered(cameraTo)
        return
    }
    setCameraRendered(interpolationCamera)

    const positionFrom = getWorldPosition(cameraFrom)
    const quaternionFrom = getWorldQuaternion(cameraFrom)

    interpolationCamera.zoom = cameraFrom.zoom
    interpolationCamera.fov = cameraFrom.fov
    updateCameraAspect(interpolationCamera)

    let ratio = 0
    const diffMax = typeof transition === "number" ? transition : Infinity
    addCameraInterpolationSystem(cameraTo, {
        positionFrom,
        quaternionFrom,
        cameraFrom,
        ratio,
        diffMax,
        setCameraRendered
    })
    return () => {
        deleteCameraInterpolationSystem(cameraTo)
    }
}, [getSplitView, getCameraComputed])
