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
import { getSelectionCandidates } from "../../throttle/getSelectionCandidates"
import { ray, vector3 } from "../../display/utils/reusables"
import visualize from "../../display/utils/visualize"
import { vec2Point } from "../../display/utils/vec2Point"

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
            if (phase !== "start" || mode !== "translate") return
            getSelectionCandidates()

            const {
                space,
                axis,
                _worldQuaternionInv,
                _quaternionStart,
                _parentScale,
                _parentQuaternionInv,
                pointEnd,
                pointStart,
                worldPosition
            } = transformControls as any
            vector3.copy(pointEnd).sub(pointStart)

            if (space === "local" && axis !== "XYZ")
                vector3.applyQuaternion(_worldQuaternionInv)

            if (axis!.indexOf("X") === -1) vector3.x = 0
            if (axis!.indexOf("Y") === -1) vector3.y = 0
            if (axis!.indexOf("Z") === -1) vector3.z = 0

            if (space === "local" && axis !== "XYZ") {
                vector3.applyQuaternion(_quaternionStart).divide(_parentScale)
            } else {
                vector3
                    .applyQuaternion(_parentQuaternionInv)
                    .divide(_parentScale)
            }

            if (axis === "Z") {
                ray.set(worldPosition, vector3.normalize())
                const pt0 = vec2Point(ray.at(1, vector3))
                const pt1 = vec2Point(ray.at(-1, vector3))
                visualize("pt0", pt0)
                visualize("pt1", pt1)
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
