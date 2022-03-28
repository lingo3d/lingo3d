import { getCameraDistance } from "../states/useCameraDistance"
import { getOrbitControls } from "../states/useOrbitControls"
import { container } from "./render/renderSetup"
import { createEffect } from "@lincode/reactivity"
import mainCamera from "./mainCamera"
import { getCamera } from "../states/useCamera"
import { getOrbitControlsEnabled } from "../states/useOrbitControlsEnabled"
import { getOrbitControlsScreenSpacePanning } from "../states/useOrbitControlsScreenSpacePanning"
import OrbitCamera from "../display/cameras/OrbitCamera"

export default {}

const mainOrbitCamera = new OrbitCamera(mainCamera)
mainOrbitCamera.enablePan = true
mainOrbitCamera.enableZoom = true
//@ts-ignore
const mainOrbitControls = mainOrbitCamera.controls

getOrbitControlsScreenSpacePanning(val => mainOrbitControls.screenSpacePanning = val)

createEffect(() => {
    const enabled = getOrbitControls() && getOrbitControlsEnabled() && getCamera() === mainCamera
    
    mainOrbitCamera.enabled = enabled
    container.style.cursor = enabled ? "grab" : "auto"

}, [getOrbitControls, getOrbitControlsEnabled, getCamera])

createEffect(() => {
    if (!getOrbitControls()) return

    let proceed = true
    queueMicrotask(() => proceed && mainOrbitCamera.setRotationX(-30))

    return () => {
        proceed = false
        mainOrbitControls.reset()
        mainOrbitCamera.setRotationX(0)
        mainOrbitCamera.setRotationY(0)
        mainOrbitCamera.setDistance(getCameraDistance())
    }
}, [getOrbitControls])