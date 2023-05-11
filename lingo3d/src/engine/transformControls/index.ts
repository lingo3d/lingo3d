import { createEffect } from "@lincode/reactivity"
import {
    emitTransformControls,
    onTransformControls,
    TransformControlsPayload
} from "../../events/onTransformControls"
import { getSelectionTarget } from "../../states/useSelectionTarget"
import { getTransformControlsSnap } from "../../states/useTransformControlsSnap"
import scene from "../scene"
import { lazy } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import { setTransformControlsDragging } from "../../states/useTransformControlsDragging"
import { getTransformControlsSpaceComputed } from "../../states/useTransformControlsSpaceComputed"
import { getCameraRendered } from "../../states/useCameraRendered"
import { getEditorModeComputed } from "../../states/useEditorModeComputed"
import { CM2M } from "../../globals"
import { deg2Rad } from "@lincode/math"
import { getMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"
import { container } from "../renderLoop/containers"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import Appendable from "../../api/core/Appendable"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"

const lazyTransformControls = lazy(async () => {
    const { TransformControls } = await import("./TransformControls")
    const transformControls = new TransformControls(
        cameraRenderedPtr[0],
        container
    )
    getCameraRendered((camera) => (transformControls.camera = camera))
    transformControls.enabled = false

    transformControls.addEventListener("dragging-changed", ({ value }) => {
        setTransformControlsDragging(value)
        emitTransformControls(value ? "start" : "end")
    })
    return transformControls
})

createEffect(() => {
    const [selectionTarget] = selectionTargetPtr
    const target =
        selectionTarget && "outerObject3d" in selectionTarget
            ? selectionTarget.outerObject3d
            : undefined

    if (!target) return

    const _mode = getEditorModeComputed()
    const mode = _mode === "curve" ? "translate" : _mode
    if (mode !== "translate" && mode !== "rotate" && mode !== "scale") return

    const space = getTransformControlsSpaceComputed()
    const snap = !getTransformControlsSnap()

    const handle0 = new Cancellable()
    lazyTransformControls().then((transformControls) => {
        if (handle0.done || !target.parent) return

        transformControls.setMode(mode)
        transformControls.setSpace(space)
        transformControls.setScaleSnap(snap ? 10 * CM2M : null)
        transformControls.setRotationSnap(snap ? 15 * deg2Rad : null)
        transformControls.setTranslationSnap(snap ? 10 * CM2M : null)

        scene.add(transformControls)
        transformControls.attach(target)
        transformControls.enabled = true

        ssrExcludeSet.add(transformControls)
        renderCheckExcludeSet.add(transformControls)

        handle0.then(() => {
            scene.remove(transformControls)
            transformControls.detach()
            transformControls.enabled = false
            ssrExcludeSet.delete(transformControls)
            renderCheckExcludeSet.delete(transformControls)
        })
    })
    const eventTargets: Array<Appendable> = []
    selectionTarget && eventTargets.push(selectionTarget)
    for (const target of getMultipleSelectionTargets()[0])
        eventTargets.push(target)

    const handle1 = onTransformControls((phase) => {
        const payload: TransformControlsPayload = { phase, mode }
        for (const target of eventTargets)
            target.emitEvent("transformEdit", payload)
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
    }
}, [
    getSelectionTarget,
    getEditorModeComputed,
    getTransformControlsSpaceComputed,
    getTransformControlsSnap
])
