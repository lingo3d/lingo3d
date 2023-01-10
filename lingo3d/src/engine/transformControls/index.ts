import { createEffect } from "@lincode/reactivity"
import {
    emitTransformControls,
    onTransformControls
} from "../../events/onTransformControls"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsSnap } from "../../states/useTransformControlsSnap"
import { container } from "../renderLoop/renderSetup"
import scene from "../scene"
import { lazy } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import { setTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getTransformControlsSpaceComputed } from "../../states/useTransformControlsSpaceComputed"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getSelectionNativeTarget } from "../../states/useSelectionNativeTarget"
import { ssrExcludeSet } from "../renderLoop/effectComposer/ssrEffect/renderSetup"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { isPositionedManager } from "../../display/core/PositionedManager"
import { PI } from "../../globals"

const lazyTransformControls = lazy(async () => {
    const { TransformControls } = await import("./TransformControls")
    const transformControls = new TransformControls(
        getCameraRendered(),
        container
    )
    //@ts-ignore
    getCameraRendered((camera) => (transformControls.camera = camera))
    //@ts-ignore
    transformControls.enabled = false

    let dragging = false
    transformControls.addEventListener("dragging-changed", ({ value }) => {
        dragging = value
        setTransformControlsDragging(dragging)
        emitTransformControls(dragging ? "start" : "end")
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
        (isPositionedManager(selectionTarget)
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
        //@ts-ignore
        transformControls.enabled = true

        ssrExcludeSet.add(transformControls)

        handle.then(() => {
            scene.remove(transformControls)
            transformControls.detach()
            //@ts-ignore
            transformControls.enabled = false
            ssrExcludeSet.delete(transformControls)
        })
    })

    const { onTranslateControl, onScaleControl, onRotateControl } =
        target.userData

    mode === "translate" &&
        onTranslateControl &&
        handle.watch(onTransformControls(onTranslateControl))

    mode === "scale" &&
        onScaleControl &&
        handle.watch(onTransformControls(onScaleControl))

    mode === "rotate" &&
        onRotateControl &&
        handle.watch(onTransformControls(onRotateControl))

    mode === "rotate" &&
        handle.watch(
            onTransformControls(() => {
                const { rotation } = target
                if (
                    (rotation.x === -PI && rotation.z === -PI) ||
                    (rotation.x === PI && rotation.z === PI)
                ) {
                    rotation.x = 0
                    rotation.y = PI - rotation.y
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