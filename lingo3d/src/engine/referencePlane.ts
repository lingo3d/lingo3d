import { Mesh, PlaneBufferGeometry } from "three"
import { diameterScaled, scaleDown } from "./constants"
import { wireframeMaterial } from "../display/utils/reusables"
import { getViewportSize } from "../states/useViewportSize"
import scene from "./scene"
import mainCamera from "./mainCamera"
import { createEffect } from "@lincode/reactivity"
import { getReferencePlane } from "../states/useReferencePlane"
import { getCamera } from "../states/useCamera"
import { onBeforeRender } from "../events/onBeforeRender"
import { getResolution } from "../states/useResolution"

const referencePlane = new Mesh(new PlaneBufferGeometry(diameterScaled, diameterScaled, 4, 4), wireframeMaterial)
export default referencePlane

createEffect(() => {
    if (!getReferencePlane() || getCamera() !== mainCamera) return

    scene.add(referencePlane)

    const [w, h] = getViewportSize() ?? getResolution()
    referencePlane.scale.x = w * scaleDown
    referencePlane.scale.y = h * scaleDown

    const handle = onBeforeRender(() => {
        referencePlane.quaternion.copy(mainCamera.quaternion)
        referencePlane.position.copy(mainCamera.position)
        referencePlane.translateZ(-4.9)
    })
    return () => {
        handle.cancel()
        scene.remove(referencePlane)
    }
}, [getReferencePlane, getViewportSize, getResolution(), getCamera])