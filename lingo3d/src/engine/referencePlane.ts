import { Mesh, PlaneGeometry } from "three"
import { wireframeMaterial } from "../display/utils/reusables"
import { getViewportSize } from "../states/useViewportSize"
import scene from "./scene"
import mainCamera from "./mainCamera"
import { createEffect } from "@lincode/reactivity"
import { getReferencePlane } from "../states/useReferencePlane"
import { getResolution } from "../states/useResolution"
import { CM2M } from "../globals"
import getWorldQuaternion from "../display/utils/getWorldQuaternion"
import getWorldPosition from "../display/utils/getWorldPosition"
import { getEditorHelper } from "../states/useEditorHelper"
import renderSystem from "../utils/renderSystem"

const referencePlane = new Mesh(
    new PlaneGeometry(1, 1, 4, 4),
    wireframeMaterial
)
export default referencePlane

const [addReferencePlaneSystem, deleteReferencePlaneSystem] =
    renderSystem((referencePlane: Mesh) => {
        referencePlane.quaternion.copy(getWorldQuaternion(mainCamera))
        referencePlane.position.copy(getWorldPosition(mainCamera))
        referencePlane.translateZ(-4.9)
    })

createEffect(() => {
    if (!getReferencePlane() || !getEditorHelper()) return

    scene.add(referencePlane)

    const [w, h] = getViewportSize() ?? getResolution()
    referencePlane.scale.x = w * CM2M
    referencePlane.scale.y = h * CM2M

    addReferencePlaneSystem(referencePlane)
    return () => {
        deleteReferencePlaneSystem(referencePlane)
        scene.remove(referencePlane)
    }
}, [getReferencePlane, getViewportSize, getResolution, getEditorHelper])
