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

const mainOrbitCamera = new OrbitCamera(mainCamera)
export default mainOrbitCamera

mainOrbitCamera.enablePan = true
mainOrbitCamera.enableZoom = true
mainOrbitCamera.enableFly = true
mainOrbitCamera.mouseControl = false
appendableRoot.delete(mainOrbitCamera)

onEditorCenterView(manager => {
    const pos = manager.getWorldPosition()
    mainOrbitCamera.targetX = pos.x
    mainOrbitCamera.targetY = pos.y
    mainOrbitCamera.targetZ = pos.z
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
    if (!getOrbitControls()) return

    let proceed = true
    queueMicrotask(() => proceed && (mainOrbitCamera.polarAngle = 60))

    return () => {
        proceed = false
        mainOrbitCamera.polarAngle = 90
        mainOrbitCamera.azimuthAngle = 0
        mainOrbitCamera.innerZ = 500
    }
}, [getOrbitControls])

createEffect(() => {
    if (getCameraRendered() !== mainCamera || getOrbitControls()) return

    const handle = getCameraDistance(cameraDistance => mainCamera.position.z = cameraDistance)

    return () => {
        handle.cancel()
    }
}, [getCameraRendered, getOrbitControls])