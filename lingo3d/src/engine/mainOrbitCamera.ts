import { getOrbitControls } from "../states/useOrbitControls"
import { container } from "./renderLoop/renderSetup"
import { createEffect } from "@lincode/reactivity"
import mainCamera from "./mainCamera"
import { getOrbitControlsScreenSpacePanning } from "../states/useOrbitControlsScreenSpacePanning"
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
mainOrbitCamera.enabled = false
appendableRoot.delete(mainOrbitCamera)

onEditorCenterView(manager => {
    const pos = manager.getWorldPosition()
    mainOrbitCamera.targetX = pos.x
    mainOrbitCamera.targetY = pos.y
    mainOrbitCamera.targetZ = pos.z
})

//@ts-ignore
const { controls } = mainOrbitCamera

getOrbitControlsScreenSpacePanning(val => controls.screenSpacePanning = val)

createEffect(() => {
    if (!getOrbitControls() || getCameraRendered() !== mainCamera || getTransformControlsDragging())
        return

    mainOrbitCamera.enabled = true
    container.style.cursor = "grab"

    return () => {
        mainOrbitCamera.enabled = false
        container.style.cursor = "auto"
    }
}, [getOrbitControls, getTransformControlsDragging, getCameraRendered])

createEffect(() => {
    if (!getOrbitControls()) return

    let proceed = true
    queueMicrotask(() => proceed && (mainOrbitCamera.polarAngle = 60))

    return () => {
        proceed = false
        controls.reset()
        mainOrbitCamera.polarAngle = 90
        mainOrbitCamera.azimuthAngle = 0
    }
}, [getOrbitControls])

createEffect(() => {
    if (getCameraRendered() !== mainCamera || getOrbitControls()) return

    const handle = getCameraDistance(cameraDistance => mainCamera.position.z = cameraDistance)

    return () => {
        handle.cancel()
    }
}, [getCameraRendered, getOrbitControls])