import { createEffect } from "@lincode/reactivity"
import { emitTransformControls } from "../events/onTransformControls"
import { getCamera } from "../states/useCamera"
import { setOrbitControlsEnabled } from "../states/useOrbitControlsEnabled"
import { setSelectionEnabled } from "../states/useSelectionEnabled"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { getTransformControlsMode } from "../states/useTransformControlsMode"
import { getTransformControlsSpace } from "../states/useTransformControlsSpace"
import { getTransformControlsSnap } from "../states/useTransformControlsSnap"
import { container } from "./render/renderSetup"
import scene from "./scene"
import { lazy } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"

export default {}

const lazyTransformControls = lazy(async () => {
    const { TransformControls } = await import("three/examples/jsm/controls/TransformControls")

    const transformControls = new TransformControls(getCamera(), container)
    getCamera(camera => transformControls.camera = camera)
    transformControls.enabled = false

    let dragging = false

    transformControls.addEventListener("dragging-changed", ({ value }) => {
        dragging = value
        setOrbitControlsEnabled(!dragging)
        setSelectionEnabled(!dragging)
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

    if (!target) return

    const { physics } = target
    let restorePhysics = false
    if (target.mass !== 0 && physics !== "map" && physics !== "map-debug") {
        target.physics = false
        restorePhysics = true
    }

    const handle = new Cancellable()

    lazyTransformControls().then(transformControls => {
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
        restorePhysics && (target.physics = physics)
    }
}, [getSelectionTarget, getTransformControlsMode, getTransformControlsSpace, getTransformControlsSnap])