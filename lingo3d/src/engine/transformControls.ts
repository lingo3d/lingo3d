import { createEffect } from "@lincode/reactivity"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import { emitTransformControls } from "../events/onTransformControls"
import { getCamera } from "../states/useCamera"
import { setOrbitControlsEnabled } from "../states/useOrbitControlsEnabled"
import { setSelectionEnabled } from "../states/useSelectionEnabled"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { getTransformControlsMode } from "../states/useTransformControlsMode"
import { getTransformControlsSpace } from "../states/useTransformControlsSpace"
import { getTransformControlsSnap } from "../states/useTransformControlsSnap"
import mainCamera from "./mainCamera"
import { container } from "./render/renderer"
import scene from "./scene"

export default {}

const transformControls = new TransformControls(getCamera(), container)
getCamera(camera => transformControls.camera = camera)
transformControls.enabled = false

createEffect(() => {
    const target = getSelectionTarget()
    const mode = getTransformControlsMode()
    const space = getTransformControlsSpace()
    const snap = getTransformControlsSnap()
    const camera = getCamera()

    if (!target || camera !== mainCamera) return

    transformControls.setMode(mode)
    transformControls.setSpace(space)
    transformControls.setScaleSnap(snap)
    transformControls.setRotationSnap(snap)
    transformControls.setTranslationSnap(snap)
    
    scene.add(transformControls)
    transformControls.attach(target.outerObject3d)
    transformControls.enabled = true
    
    return () => {
        scene.remove(transformControls)
        transformControls.detach()
        transformControls.enabled = false
    }
}, [getSelectionTarget, getTransformControlsMode, getTransformControlsSpace, getTransformControlsSnap, getCamera])

let dragging = false

transformControls.addEventListener("dragging-changed", ({ value }) => {
    dragging = value
    setOrbitControlsEnabled(!dragging)
    setSelectionEnabled(!dragging)
    emitTransformControls(dragging ? "start" : "stop")
})

transformControls.addEventListener("change", () => dragging && emitTransformControls("move"))