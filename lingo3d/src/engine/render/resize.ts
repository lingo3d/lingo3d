import { deg2Rad } from "@lincode/math"
import { createEffect } from "@lincode/reactivity"
import { OrthographicCamera, PerspectiveCamera } from "three"
import { scaleDown } from "../constants"
import { frustum } from "../../display/cameras/OrthographicCamera"
import { getCamera } from "../../states/useCamera"
import { setCameraDistance } from "../../states/useCameraDistance"
import { getContainerSize } from "../../states/useContainerSize"
import { setContainerZoom } from "../../states/useContainerZoom"
import { getViewportSize } from "../../states/useViewportSize"
import mainCamera from "../mainCamera"
import { outline, container } from "./renderer"

export default {}

const getZ = (height: number, camera: PerspectiveCamera) => Math.abs((height * 0.5) / Math.cos(camera.fov * 0.6 * deg2Rad))

createEffect(() => {
    const [containerWidth, containerHeight] = getContainerSize()
    const [viewportWidth, viewportHeight] = getViewportSize()
    const camera = getCamera()

    const aspect = containerWidth / containerHeight

    if (camera instanceof PerspectiveCamera) {
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
        width: containerWidth,
        height: viewportHeight - ((viewportWidth - containerWidth) * viewportHeight / viewportWidth)
    }
    const size1 = {
        width: viewportWidth - ((viewportHeight - containerHeight) * viewportWidth / viewportHeight),
        height: containerHeight
    }

    const val0 = Math.min(containerWidth - size0.width, containerHeight - size0.height)
    const val1 = Math.min(containerWidth - size1.width, containerHeight - size1.height)

    if (val0 > val1) {
        camera === mainCamera && setCameraDistance(getZ(viewportWidth / aspect, mainCamera) * scaleDown)
        Object.assign(outline.style, { width: size0.width + "px", height: size0.height + "px" })
        setContainerZoom(size0.width / viewportWidth)
    }
    else {
        camera === mainCamera && setCameraDistance(getZ(viewportHeight, mainCamera) * scaleDown)
        Object.assign(outline.style, { width: size1.width + "px", height: size1.height + "px" })
        setContainerZoom(size1.width / viewportWidth)
    }

    Object.assign(container.style, { width: containerWidth + "px", height: containerHeight + "px" })

}, [getContainerSize, getViewportSize, getCamera])