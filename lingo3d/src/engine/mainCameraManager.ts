import { createEffect } from "@lincode/reactivity"
import mainCamera from "./mainCamera"
import OrbitCamera from "../display/cameras/OrbitCamera"
import { getTransformControlsDragging } from "../states/useTransformControlsDragging"
import { onEditorCenterView } from "../events/onEditorCenterView"
import { getCameraRendered } from "../states/useCameraRendered"
import getActualScale from "../display/utils/getActualScale"
import { M2CM } from "../globals"
import { getEditorBehavior } from "../states/useEditorBehavior"
import { container } from "./renderLoop/containers"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { eraseAppendable } from "../display/utils/eraseAppendable"

const mainCameraManager = new OrbitCamera(mainCamera)
export default mainCameraManager

mainCameraManager.name = "camera"
mainCameraManager.enableZoom = true
mainCameraManager.enableFly = true
mainCameraManager.mouseControl = false
eraseAppendable(mainCameraManager)

onEditorCenterView((manager) => {
    Object.assign(mainCameraManager, manager.worldPosition)
    const size = getActualScale(manager)
    mainCameraManager.innerZ = Math.max(size.x, size.y, size.z, 1) * M2CM + 50
})

createEffect(() => {
    if (
        !getEditorBehavior() ||
        cameraRenderedPtr[0] !== mainCamera ||
        getTransformControlsDragging()
    )
        return

    mainCameraManager.mouseControl = "drag"
    container.style.cursor = "grab"

    return () => {
        mainCameraManager.mouseControl = false
        container.style.cursor = "auto"
    }
}, [getEditorBehavior, getTransformControlsDragging, getCameraRendered])
