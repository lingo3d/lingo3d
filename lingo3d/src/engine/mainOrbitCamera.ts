import { getOrbitControls } from "../states/useOrbitControls"
import { container } from "./renderLoop/renderSetup"
import { createEffect } from "@lincode/reactivity"
import mainCamera from "./mainCamera"
import OrbitCamera from "../display/cameras/OrbitCamera"
import { getTransformControlsDragging } from "../states/useTransformControlsDragging"
import { appendableRoot } from "../api/core/Appendable"
import { onEditorCenterView } from "../events/onEditorCenterView"
import { getCameraDistance } from "../states/useCameraDistance"
import { getCameraRendered } from "../states/useCameraRendered"
import getActualScale from "../display/utils/getActualScale"
import { scaleUp } from "./constants"

const mainOrbitCamera = new OrbitCamera(mainCamera)
export default mainOrbitCamera

mainOrbitCamera.enableZoom = true
mainOrbitCamera.enableFly = true
mainOrbitCamera.mouseControl = false
appendableRoot.delete(mainOrbitCamera)

onEditorCenterView(manager => {
    const pos = manager.getWorldPosition()
    mainOrbitCamera.x = pos.x
    mainOrbitCamera.y = pos.y
    mainOrbitCamera.z = pos.z
    
    const size = getActualScale(manager)
    mainOrbitCamera.innerZ = Math.max(size.x, size.y, size.z, 1) * scaleUp + 50
})

getOrbitControls(val => {
    if (val) return
    mainOrbitCamera.setPolarAngle(90)
    mainOrbitCamera.setAzimuthAngle(90)
})

createEffect(() => {
    if (!getOrbitControls() || getCameraRendered() !== mainCamera || getTransformControlsDragging())
        return

    mainOrbitCamera.mouseControl = "drag"
    container.style.cursor = "grab"

    return () => {
        mainOrbitCamera.mouseControl = false
        container.style.cursor = "auto"
    }
}, [getOrbitControls, getTransformControlsDragging, getCameraRendered])

createEffect(() => {
    if (getCameraRendered() !== mainCamera || getOrbitControls()) return

    const handle = getCameraDistance(cameraDistance => mainOrbitCamera.innerZ = cameraDistance)

    return () => {
        handle.cancel()
    }
}, [getCameraRendered, getOrbitControls])