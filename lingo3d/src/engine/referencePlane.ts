import { Mesh, PlaneGeometry } from "three"
import { wireframeMaterial } from "../display/utils/reusables"
import { getViewportSize } from "../states/useViewportSize"
import scene from "./scene"
import mainCamera from "./mainCamera"
import { createEffect } from "@lincode/reactivity"
import { getReferencePlane } from "../states/useReferencePlane"
import { onBeforeRender } from "../events/onBeforeRender"
import { getResolution } from "../states/useResolution"
import { getCameraRendered } from "../states/useCameraRendered"
import { CM2M } from "../globals"
import getWorldQuaternion from "../display/utils/getWorldQuaternion"
import getWorldPosition from "../display/utils/getWorldPosition"

const referencePlane = new Mesh(
    new PlaneGeometry(1, 1, 4, 4),
    wireframeMaterial
)
export default referencePlane

createEffect(() => {
    if (!getReferencePlane() || getCameraRendered() !== mainCamera) return

    scene.add(referencePlane)

    const [w, h] = getViewportSize() ?? getResolution()
    referencePlane.scale.x = w * CM2M
    referencePlane.scale.y = h * CM2M

    const handle = onBeforeRender(() => {
        referencePlane.quaternion.copy(getWorldQuaternion(mainCamera))
        referencePlane.position.copy(getWorldPosition(mainCamera))
        referencePlane.translateZ(-4.9)
    })
    return () => {
        handle.cancel()
        scene.remove(referencePlane)
    }
}, [getReferencePlane, getViewportSize, getResolution, getCameraRendered])
