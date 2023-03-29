import store, { createEffect } from "@lincode/reactivity"
import { OrthographicCamera, PerspectiveCamera } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import mainCamera from "../engine/mainCamera"
import getWorldPosition from "../display/utils/getWorldPosition"
import getWorldQuaternion from "../display/utils/getWorldQuaternion"
import { getSplitView } from "./useSplitView"
import { getCameraComputed } from "./useCameraComputed"
import {
    addCameraInterpolationSystem,
    deleteCameraInterpolationSystem
} from "../systems/cameraInterpolationSystem"
import { getResolution } from "./useResolution"
import { ORTHOGRAPHIC_FRUSTUM } from "../globals"
import { getWebXR } from "./useWebXR"

const [setCameraRendered, getCameraRendered] =
    store<PerspectiveCamera>(mainCamera)
export { getCameraRendered }

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

    let ratio = 0
    const diffMax = typeof transition === "number" ? transition : Infinity
    addCameraInterpolationSystem(cameraTo, {
        positionFrom,
        quaternionFrom,
        cameraFrom,
        ratio,
        diffMax,
        onFinish: () => setCameraRendered(cameraTo)
    })
    return () => {
        deleteCameraInterpolationSystem(cameraTo)
    }
}, [getSplitView, getCameraComputed])

createEffect(() => {
    const camera = getCameraRendered() as PerspectiveCamera | OrthographicCamera
    const [resX, resY] = getResolution()
    const aspect = resX / resY

    if (camera instanceof PerspectiveCamera && !getWebXR()) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        return
    }
    if (camera instanceof OrthographicCamera) {
        camera.left = aspect * ORTHOGRAPHIC_FRUSTUM * -0.5
        camera.right = aspect * ORTHOGRAPHIC_FRUSTUM * 0.5
        camera.top = ORTHOGRAPHIC_FRUSTUM * 0.5
        camera.bottom = ORTHOGRAPHIC_FRUSTUM * -0.5
        camera.updateProjectionMatrix()
    }
}, [getCameraRendered, getResolution])
