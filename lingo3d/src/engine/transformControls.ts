import { createEffect } from "@lincode/reactivity"
import {
    emitTransformControls,
    onTransformControls
} from "../events/onTransformControls"
import { getSelectionTarget } from "../states/useSelectionTarget"
import { getTransformControlsSnap } from "../states/useTransformControlsSnap"
import { container } from "./renderLoop/renderSetup"
import scene from "./scene"
import { lazy } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import { setTransformControlsDragging } from "../states/useTransformControlsDragging"
import { getTransformControlsSpaceComputed } from "../states/useTransformControlsSpaceComputed"
import { getCameraRendered } from "../states/useCameraRendered"
import { getSelectionNativeTarget } from "../states/useSelectionNativeTarget"
import { ssrExcludeSet } from "./renderLoop/effectComposer/ssrEffect/renderSetup"
import { getEditorModeComputed } from "../states/useEditorModeComputed"
import { isPositionedItem } from "../api/core/PositionedItem"

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
    const selectionTarget = getSelectionTarget()
    const target =
        getSelectionNativeTarget() ??
        (isPositionedItem(selectionTarget)
            ? selectionTarget.outerObject3d
            : undefined)

    if (!target) return

    let mode = getEditorModeComputed()
    if (mode === "curve") mode = "translate"

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

        ssrExcludeSet.add(transformControls)

        handle.then(() => {
            scene.remove(transformControls)
            transformControls.detach()
            transformControls.enabled = false
            ssrExcludeSet.delete(transformControls)
        })
    })
    mode === "rotate" &&
        handle.watch(
            onTransformControls(() => {
                const { rotation } = target
                if (
                    (rotation.x === -Math.PI && rotation.z === -Math.PI) ||
                    (rotation.x === Math.PI && rotation.z === Math.PI)
                ) {
                    rotation.x = 0
                    rotation.y = Math.PI - rotation.y
                    rotation.z = 0
                }
            })
        )

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
