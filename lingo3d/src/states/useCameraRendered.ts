import store, { createEffect } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
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
import updateCameraAspect from "../display/utils/updateCameraAspect"

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
