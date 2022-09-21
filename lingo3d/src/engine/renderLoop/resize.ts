import { deg2Rad } from "@lincode/math"
import { createEffect } from "@lincode/reactivity"
import { PerspectiveCamera } from "three"
import { setCameraDistance } from "../../states/useCameraDistance"
import { getViewportSize } from "../../states/useViewportSize"
import mainCamera from "../mainCamera"
import { getWebXR } from "../../states/useWebXR"
import { getResolution } from "../../states/useResolution"
import {
    getCameraRendered,
    updateCameraAspect
} from "../../states/useCameraRendered"

const getZ = (height: number, camera: PerspectiveCamera) =>
    Math.abs((height * 0.5) / Math.cos(camera.fov * 0.6 * deg2Rad))

createEffect(() => {
    const [vw, vh] = getViewportSize() ?? getResolution()
    const [resX, resY, aspect] = updateCameraAspect(getCameraRendered())

    const size0 = {
        width: resX,
        height: vh - ((vw - resX) * vh) / vw
    }
    const size1 = {
        width: vw - ((vh - resY) * vw) / vh,
        height: resY
    }

    const val0 = Math.min(resX - size0.width, resY - size0.height)
    const val1 = Math.min(resX - size1.width, resY - size1.height)

    if (val0 > val1) {
        setCameraDistance(getZ(vw / aspect, mainCamera))
        // Object.assign(referenceOutline.style, { width: size0.width + "px", height: size0.height + "px" })
    } else {
        setCameraDistance(getZ(vh, mainCamera))
        // Object.assign(referenceOutline.style, { width: size1.width + "px", height: size1.height + "px" })
    }
}, [getResolution, getViewportSize, getCameraRendered, getWebXR])
