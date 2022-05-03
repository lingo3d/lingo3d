import { getCameraDistance } from "../states/useCameraDistance"
import { getOrbitControls } from "../states/useOrbitControls"
import { container } from "./renderLoop/renderSetup"
import { createEffect } from "@lincode/reactivity"
import mainCamera from "./mainCamera"
import { getCamera } from "../states/useCamera"
import { getOrbitControlsScreenSpacePanning } from "../states/useOrbitControlsScreenSpacePanning"
import OrbitCamera from "../display/cameras/OrbitCamera"
import { getTransformControlsDragging } from "../states/useTransformControlsDragging"
import { appendableRoot } from "../api/core/Appendable"
import { onSceneGraphDoubleClick } from "../events/onSceneGraphDoubleClick"

export default {}

const mainOrbitCamera = new OrbitCamera(mainCamera)
mainOrbitCamera.enablePan = true
mainOrbitCamera.enableZoom = true
mainOrbitCamera.enableFly = true
appendableRoot.delete(mainOrbitCamera)

onSceneGraphDoubleClick(manager => {
    const pos = manager.getCenter()
    mainOrbitCamera.targetX = pos.x
    mainOrbitCamera.targetY = pos.y
    mainOrbitCamera.targetZ = pos.z
})

//@ts-ignore
const { controls } = mainOrbitCamera

getOrbitControlsScreenSpacePanning(val => controls.screenSpacePanning = val)

createEffect(() => {
    const enabled = getOrbitControls() && !getTransformControlsDragging() && getCamera() === mainCamera
    
    mainOrbitCamera.enabled = enabled
    container.style.cursor = enabled ? "grab" : "auto"

}, [getOrbitControls, getTransformControlsDragging, getCamera])

createEffect(() => {
    if (!getOrbitControls()) return

    let proceed = true
    queueMicrotask(() => proceed && (mainOrbitCamera.polarAngle = 60))

    return () => {
        proceed = false
        controls.reset()
        mainOrbitCamera.polarAngle = 90
        mainOrbitCamera.azimuthAngle = 0
        mainOrbitCamera.distance = getCameraDistance()
    }
}, [getOrbitControls])