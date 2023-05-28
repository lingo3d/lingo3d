import store, { createEffect } from "@lincode/reactivity"
import { OrthographicCamera, PerspectiveCamera } from "three"
import interpolationCamera from "../engine/interpolationCamera"
import mainCamera from "../engine/mainCamera"
import getWorldPosition from "../memo/getWorldPosition"
import getWorldQuaternion from "../memo/getWorldQuaternion"
import { getSplitView } from "./useSplitView"
import { getCameraComputed } from "./useCameraComputed"
import { getResolution } from "./useResolution"
import { ORTHOGRAPHIC_FRUSTUM } from "../globals"
import { getWebXR } from "./useWebXR"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { cameraTransitionSet } from "../collections/cameraTransitionSet"
import { resolutionPtr } from "../pointers/resolutionPtr"
import { cameraInterpolationSystem } from "../systems/cameraInterpolationSystem"

const [setCameraRendered, getCameraRendered] =
    store<PerspectiveCamera>(mainCamera)
export { getCameraRendered }

getCameraRendered((cam) => (cameraRenderedPtr[0] = cam))

let cameraLast: PerspectiveCamera | undefined

createEffect(() => {
    if (getSplitView()) {
        setCameraRendered(mainCamera)
        return
    }
    const cameraFrom =
        cameraRenderedPtr[0] === interpolationCamera
            ? interpolationCamera
            : cameraLast

    const cameraTo = (cameraLast = getCameraComputed())
    if (
        !cameraFrom ||
        !cameraTransitionSet.has(cameraTo) ||
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

    cameraInterpolationSystem.add(cameraTo, {
        positionFrom,
        quaternionFrom,
        cameraFrom,
        progress: 0,
        diffMax: 0.02,
        onFinish: () => setCameraRendered(cameraTo)
    })
    return () => {
        cameraInterpolationSystem.delete(cameraTo)
    }
}, [getSplitView, getCameraComputed])

createEffect(() => {
    const camera = cameraRenderedPtr[0] as
        | PerspectiveCamera
        | OrthographicCamera
    const [[resX, resY]] = resolutionPtr
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
