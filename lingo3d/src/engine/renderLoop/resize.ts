import { deg2Rad } from "@lincode/math"
import { createEffect } from "@lincode/reactivity"
import { Camera, OrthographicCamera, PerspectiveCamera } from "three"
import { scaleDown } from "../constants"
import { frustum } from "../../display/cameras/OrthographicCamera"
import { getCamera } from "../../states/useCamera"
import { setCameraDistance } from "../../states/useCameraDistance"
import { getViewportSize } from "../../states/useViewportSize"
import mainCamera from "../mainCamera"
import { referenceOutline, rootContainer } from "./renderSetup"
import { getVR } from "../../states/useVR"
import { getResolution } from "../../states/useResolution"

export default {}

const getZ = (height: number, camera: PerspectiveCamera) => Math.abs((height * 0.5) / Math.cos(camera.fov * 0.6 * deg2Rad))

createEffect(() => {
    const [resX, resY] = getResolution()
    const [vw, vh] = getViewportSize() ?? getResolution()
    const camera: Camera = getCamera()

    const aspect = resX / resY

    if (camera instanceof PerspectiveCamera && !getVR()) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    }
    else if (camera instanceof OrthographicCamera) {
        [camera.left, camera.right, camera.top, camera.bottom] = [
            aspect * frustum * -0.5, aspect * frustum * 0.5, frustum * 0.5, frustum * -0.5
        ]
        camera.updateProjectionMatrix()
    }

    const size0 = {
        width: resX,
        height: vh - ((vw - resX) * vh / vw)
    }
    const size1 = {
        width: vw - ((vh - resY) * vw / vh),
        height: resY
    }

    const val0 = Math.min(resX - size0.width, resY - size0.height)
    const val1 = Math.min(resX - size1.width, resY - size1.height)

    if (val0 > val1) {
        setCameraDistance(getZ(vw / aspect, mainCamera) * scaleDown)
        Object.assign(referenceOutline.style, { width: size0.width + "px", height: size0.height + "px" })
    }
    else {
        setCameraDistance(getZ(vh, mainCamera) * scaleDown)
        Object.assign(referenceOutline.style, { width: size1.width + "px", height: size1.height + "px" })
    }

    // Object.assign(rootContainer.style, { width: resX + "px", height: resY + "px" })

}, [getResolution, getViewportSize, getCamera, getVR])