import { createEffect } from "@lincode/reactivity"
import {
    emitTransformControls,
    onTransformControls
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
import { container } from "../renderLoop/containers"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { transformControlsModePtr } from "../../pointers/transformControlsModePtr"
import root from "../../api/root"

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

    transformControlsModePtr[0] = mode

    const space = getTransformControlsSpaceComputed()
    const snap = !getTransformControlsSnap()

    const handle = new Cancellable()
    lazyTransformControls().then((transformControls) => {
        if (handle.done || !target.parent) return

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

        const handle0 = onTransformControls((phase) => {
            if (phase !== "start") return
            for (const child of selectionTargetPtr[0]?.parent?.children ?? []) {
                if (child === selectionTargetPtr[0]) continue
                
            }
        })

        handle.then(() => {
            scene.remove(transformControls)
            transformControls.detach()
            transformControls.enabled = false
            ssrExcludeSet.delete(transformControls)
            renderCheckExcludeSet.delete(transformControls)
            handle0.cancel()
        })
    })
    return () => {
        handle.cancel()
    }
}, [
    getSelectionTarget,
    getEditorModeComputed,
    getTransformControlsSpaceComputed,
    getTransformControlsSnap
])
