import { deg2Rad, Point3d } from "@lincode/math"
import store, { createEffect, createMemo, createRef } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import VisibleMixin from "../display/core/mixins/VisibleMixin"
import { raycast } from "../display/core/utils/raycast/attachRaycastEvent"
import HelperSphere from "../display/core/utils/HelperSphere"
import clientToWorld from "../display/utils/clientToWorld"
import normalizeClientPosition from "../display/utils/normalizeClientPosition"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { Mesh, PlaneGeometry } from "three"
import { standardMaterial } from "../display/utils/reusables"
import scene from "../engine/scene"
import { getGrid } from "./useGrid"
import { selectionCandidates } from "../collections/selectionCandidates"
import { selectionDisabledSet } from "../collections/selectionDisabledSet"

export const [setEditorDragEvent, getEditorDragEvent] = store<
    | DragEvent
    | ((hitManager?: Appendable) => Appendable | undefined)
    | undefined
>(undefined)

const snap = (point: Point3d) => {
    point.x = Math.round(point.x / 10) * 10
    point.y = Math.round(point.y / 10) * 10
    point.z = Math.round(point.z / 10) * 10
    return point
}

const editorPlane = new Mesh(new PlaneGeometry(1000, 1000), standardMaterial)
editorPlane.rotateX(90 * deg2Rad)
editorPlane.visible = false
scene.add(editorPlane)

createEffect(() => {
    const e = getEditorDragEvent()
    const pointRef = createRef<Point3d>({ x: 0, y: 0, z: 0 })
    const hitManagerRef = createRef<VisibleMixin | undefined>()

    const isDragEvent = e instanceof DragEvent
    const indicator = createMemo(() => {
        if (!isDragEvent) return
        const indicator = new HelperSphere(undefined)
        selectionDisabledSet.add(indicator)
        return indicator
    }, [isDragEvent])

    if (typeof e === "function") {
        const manager = e(hitManagerRef.current)
        if (!manager) return
        Object.assign(manager, snap(pointRef.current))
        emitSelectionTarget(manager)
        return
    }

    if (!isDragEvent || !indicator) return

    const [xNorm, yNorm] = normalizeClientPosition(e.clientX, e.clientY)
    const hit = raycast(selectionCandidates, {
        x: xNorm,
        y: yNorm,
        additionalCandidate: getGrid() ? editorPlane : undefined
    })
    hitManagerRef.current = hit?.manager
    const point = hit?.point ?? clientToWorld(e.clientX, e.clientY)
    Object.assign(indicator, point)
    pointRef.current = point
    return () => {
        !(getEditorDragEvent() instanceof DragEvent) && indicator.dispose()
    }
}, [getEditorDragEvent])
