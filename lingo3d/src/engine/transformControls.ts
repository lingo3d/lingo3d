import { createEffect } from "@lincode/reactivity"
import { emitTransformControls } from "../events/onTransformControls"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { getTransformControlsSnap } from "../states/useTransformControlsSnap"
import { container } from "./renderLoop/renderSetup"
import scene from "./scene"
import { lazy } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import { setTransformControlsDragging } from "../states/useTransformControlsDragging"
import { getEditorModeComputed } from "../states/useEditorModeComputed"
import { getTransformControlsSpaceComputed } from "../states/useTransformControlsSpaceComputed"
import { getCameraRendered } from "../states/useCameraRendered"
import { getSelectionNativeTarget } from "../states/useSelectionNativeTarget"
import initHelperSSR from "../display/core/utils/initHelperSSR"

const lazyTransformControls = lazy(async () => {
    const { TransformControls } = await import(
        "three/examples/jsm/controls/TransformControls"
    )

    const transformControls = new TransformControls(
        getCameraRendered(),
        container
    )
    getCameraRendered((camera) => (transformControls.camera = camera))
    transformControls.enabled = false

    let dragging = false

    transformControls.addEventListener("dragging-changed", ({ value }) => {
        dragging = value
        setTransformControlsDragging(dragging)
        emitTransformControls(dragging ? "start" : "stop")
    })

    transformControls.addEventListener(
        "change",
        () => dragging && emitTransformControls("move")
    )

    return transformControls
})

createEffect(() => {
    const target =
        getSelectionNativeTarget() ?? getSelectionTarget()?.outerObject3d
    if (!target) return

    let mode = getEditorModeComputed()
    if (mode === "path") mode = "translate"

    const space = getTransformControlsSpaceComputed()
    const snap = getTransformControlsSnap()

    const handle = new Cancellable()

    lazyTransformControls().then((transformControls) => {
        if (
            handle.done ||
            !target.parent ||
            (mode !== "translate" && mode !== "rotate" && mode !== "scale")
        )
            return

        transformControls.setMode(mode)
        transformControls.setSpace(space)
        transformControls.setScaleSnap(snap)
        transformControls.setRotationSnap(snap)
        transformControls.setTranslationSnap(snap)

        scene.add(transformControls)
        transformControls.attach(target)
        transformControls.enabled = true

        const helperHandle = initHelperSSR(transformControls)

        handle.then(() => {
            scene.remove(transformControls)
            transformControls.detach()
            transformControls.enabled = false
            helperHandle.cancel()
        })
    })
    return () => {
        handle.cancel()
    }
}, [
    getSelectionTarget,
    getSelectionNativeTarget,
    getEditorModeComputed,
    getTransformControlsSpaceComputed,
    getTransformControlsSnap
])
