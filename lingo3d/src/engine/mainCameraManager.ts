import { createEffect } from "@lincode/reactivity"
import mainCamera from "./mainCamera"
import OrbitCamera from "../display/cameras/OrbitCamera"
import { getTransformControlsDragging } from "../states/useTransformControlsDragging"
import { onEditorCenterView } from "../events/onEditorCenterView"
import { getCameraRendered } from "../states/useCameraRendered"
import getActualScale from "../memo/getActualScale"
import { M2CM } from "../globals"
import { getEditorBehavior } from "../states/useEditorBehavior"
import { container } from "./renderLoop/containers"
import { cameraRenderedPtr } from "../pointers/cameraRenderedPtr"
import { editorBehaviorPtr } from "../pointers/editorBehaviorPtr"
import { onUnload } from "../events/onUnload"

const mainCameraManager = new OrbitCamera(mainCamera)
export default mainCameraManager
mainCameraManager.remove()
mainCameraManager.name = "camera"
mainCameraManager.enableZoom = true
mainCameraManager.enableFly = true
mainCameraManager.mouseControl = false

onEditorCenterView((manager) => {
    Object.assign(mainCameraManager, manager.getWorldPosition())
    const size = getActualScale(manager)
    mainCameraManager.innerZ = Math.max(size.x, size.y, size.z, 1) * M2CM + 50
})

createEffect(() => {
    if (
        !editorBehaviorPtr[0] ||
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

const resetMainCameraManager = () => {
    mainCameraManager.x = 0
    mainCameraManager.y = 0
    mainCameraManager.z = 0
    mainCameraManager.rotationX = 0
    mainCameraManager.rotationY = 0
    mainCameraManager.rotationZ = 0
    mainCameraManager.polarAngle = editorBehaviorPtr[0] ? 120 : 0
    mainCameraManager.azimuthAngle = 0
}
getEditorBehavior(
    (editorBehavior) => editorBehavior && resetMainCameraManager()
)
onUnload(() => resetMainCameraManager())
