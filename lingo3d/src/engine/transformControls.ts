import { createEffect } from "@lincode/reactivity"
import { emitTransformControls } from "../events/onTransformControls"
import { getCamera } from "../states/useCamera"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { getTransformControlsMode } from "../states/useTransformControlsMode"
import { getTransformControlsSpace } from "../states/useTransformControlsSpace"
import { getTransformControlsSnap } from "../states/useTransformControlsSnap"
import { container } from "./renderLoop/renderSetup"
import scene from "./scene"
import { lazy } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import mainCamera from "./mainCamera"
import { setTransformControlsDragging } from "../states/useTransformControlsDragging"

export default {}

const lazyTransformControls = lazy(async () => {
    const { TransformControls } = await import("three/examples/jsm/controls/TransformControls")

    const transformControls = new TransformControls(getCamera(), container)
    getCamera(camera => transformControls.camera = camera)
    transformControls.enabled = false

    let dragging = false

    transformControls.addEventListener("dragging-changed", ({ value }) => {
        dragging = value
        setTransformControlsDragging(dragging)
        emitTransformControls(dragging ? "start" : "stop")
    })

    transformControls.addEventListener("change", () => dragging && emitTransformControls("move"))
    
    return transformControls
})

createEffect(() => {
    const target = getSelectionTarget()
    const mode = getTransformControlsMode()
    const space = getTransformControlsSpace()
    const snap = getTransformControlsSnap()

    if (!target || getCamera() !== mainCamera) return

    const handle = new Cancellable()

    lazyTransformControls().then(transformControls => {
        if (mode === "select") {
            transformControls.enabled = false
            return
        }
        transformControls.setMode(mode)
        transformControls.setSpace(space)
        transformControls.setScaleSnap(snap)
        transformControls.setRotationSnap(snap)
        transformControls.setTranslationSnap(snap)

        scene.add(transformControls)
        transformControls.attach(target.outerObject3d)
        transformControls.enabled = true

        handle.then(() => {
            scene.remove(transformControls)
            transformControls.detach()
            transformControls.enabled = false
        })
    })
    return () => {
        handle.cancel()
    }
}, [getSelectionTarget, getTransformControlsMode, getTransformControlsSpace, getTransformControlsSnap, getCamera])