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
import { container } from "../renderLoop/containers"
import { ssrExcludeSet } from "../../collections/ssrExcludeSet"
import { cameraRenderedPtr } from "../../pointers/cameraRenderedPtr"
import { selectionTargetPtr } from "../../pointers/selectionTargetPtr"
import { renderCheckExcludeSet } from "../../collections/renderCheckExcludeSet"
import { transformControlsModePtr } from "../../pointers/transformControlsModePtr"
import { vector3 } from "../../display/utils/reusables"
import { snapRaycastSystem } from "../../systems/snapRaycastSystem"
import { DEG2RAD } from "three/src/math/MathUtils"

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
        selectionTarget && "$object" in selectionTarget
            ? selectionTarget.$object
            : undefined
    if (!target?.parent) return

    const _mode = getEditorModeComputed()
    const mode = _mode === "curve" ? "translate" : _mode
    if (mode !== "translate" && mode !== "rotate" && mode !== "scale") return

    transformControlsModePtr[0] = mode

    const space = getTransformControlsSpaceComputed()
    const snap = !getTransformControlsSnap()

    const handle = new Cancellable()
    lazyTransformControls().then((transformControls) => {
        if (handle.done) return

        transformControls.setMode(mode)
        transformControls.setSpace(space)
        transformControls.setScaleSnap(snap ? 10 * CM2M : null)
        transformControls.setRotationSnap(snap ? 15 * DEG2RAD : null)
        // transformControls.setTranslationSnap(snap ? 10 * CM2M : null)

        scene.add(transformControls)
        transformControls.attach(target)
        transformControls.enabled = true

        ssrExcludeSet.add(transformControls)
        renderCheckExcludeSet.add(transformControls)

        const handle0 = onTransformControls((phase) => {
            if (phase !== "start" || mode !== "translate") {
                snapRaycastSystem.delete(transformControls)
                return
            }
            const {
                space,
                axis,
                _worldQuaternionInv,
                _quaternionStart,
                _parentScale,
                _parentQuaternionInv,
                pointEnd,
                pointStart
            } = transformControls as any
            if (!(axis === "X" || axis === "Y" || axis === "Z")) {
                snapRaycastSystem.delete(transformControls)
                return
            }
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
            // snapRaycastSystem.add(transformControls, {
            //     direction0: vector3.clone().normalize(),
            //     direction1: vector3.clone().multiplyScalar(-1).normalize()
            // })
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
