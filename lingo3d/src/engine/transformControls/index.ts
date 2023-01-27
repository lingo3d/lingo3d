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
import { CM2M } from "../../globals"
import { deg2Rad } from "@lincode/math"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"

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
        (selectionTarget && "outerObject3d" in selectionTarget
            ? selectionTarget.outerObject3d
            : undefined)

    if (!target) return

    let mode = getEditorModeComputed()
    if (mode === "curve") mode = "translate"

    const space = getTransformControlsSpaceComputed()
    const snap = !getTransformControlsSnap()

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
        transformControls.setScaleSnap(snap ? 10 * CM2M : null)
        transformControls.setRotationSnap(snap ? 15 * deg2Rad : null)
        transformControls.setTranslationSnap(snap ? 10 * CM2M : null)

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

    const onTranslateControls: Array<() => void> = []
    const onRotateControls: Array<() => void> = []
    const onScaleControls: Array<() => void> = []

    const { onTranslateControl, onRotateControl, onScaleControl } =
        target.userData
    onTranslateControl && onTranslateControls.push(onTranslateControl)
    onRotateControl && onRotateControls.push(onRotateControl)
    onScaleControl && onScaleControls.push(onScaleControl)

    for (const target of getMultipleSelectionTargets()[0]) {
        const { onTranslateControl, onRotateControl, onScaleControl } =
            target.userData
        onTranslateControl && onTranslateControls.push(onTranslateControl)
        onRotateControl && onRotateControls.push(onRotateControl)
        onScaleControl && onScaleControls.push(onScaleControl)
    }
    mode === "translate" &&
        handle.watch(
            onTransformControls(() => {
                for (const onTranslateControl of onTranslateControls)
                    onTranslateControl()
            })
        )
    mode === "rotate" &&
        handle.watch(
            onTransformControls(() => {
                for (const onRotateControl of onRotateControls)
                    onRotateControl()
            })
        )
    mode === "scale" &&
        handle.watch(
            onTransformControls(() => {
                for (const onScaleControl of onScaleControls) onScaleControl()
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
