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
import { getCameraDistance } from "../states/useCameraDistance"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { getSelectionTarget } from "../states/useSelectionTarget"

export default {}

const mainOrbitCamera = new OrbitCamera(mainCamera)
mainOrbitCamera.enablePan = true
mainOrbitCamera.enableZoom = true
mainOrbitCamera.enableFly = true
appendableRoot.delete(mainOrbitCamera)

const centerManager = (manager: SimpleObjectManager) => {
    const pos = manager.getCenter()
    mainOrbitCamera.targetX = pos.x
    mainOrbitCamera.targetY = pos.y
    mainOrbitCamera.targetZ = pos.z
}

onSceneGraphDoubleClick(centerManager)

//@ts-ignore
const { controls } = mainOrbitCamera

getOrbitControlsScreenSpacePanning(val => controls.screenSpacePanning = val)

createEffect(() => {
    if (!getOrbitControls() || getCamera() !== mainCamera || getTransformControlsDragging())
        return

    mainOrbitCamera.enabled = true
    container.style.cursor = "grab"

    return () => {
        mainOrbitCamera.enabled = false
        container.style.cursor = "auto"
    }
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
    }
}, [getOrbitControls])

createEffect(() => {
    if (getCamera() !== mainCamera) return

    if (getOrbitControls()) {
        const cb = (e: KeyboardEvent) => {
            if (e.key.toLocaleLowerCase() !== "c") return
            const target = getSelectionTarget()
            target instanceof SimpleObjectManager && centerManager(target)
        }
        document.addEventListener("keydown", cb)

        return () => {
            document.removeEventListener("keydown", cb)
        }
    }

    const handle = getCameraDistance(cameraDistance => mainCamera.position.z = cameraDistance)

    return () => {
        handle.cancel()
    }
}, [getCamera, getOrbitControls])