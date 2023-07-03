import store, { createEffect, createMemo, createRef } from "@lincode/reactivity"
import Appendable from "../display/core/Appendable"
import VisibleMixin from "../display/core/mixins/VisibleMixin"
import HelperSphere from "../display/core/utils/HelperSphere"
import clientToWorld from "../display/utils/clientToWorld"
import normalizeClientPosition from "../display/utils/normalizeClientPosition"
import { emitSelectionTarget } from "../events/onSelectionTarget"
import { selectionCandidates } from "../collections/selectionCandidates"
import { raycast } from "../memo/raycast"
import { Point3dType } from "../typeGuards/isPoint"
import { pushUndoStack } from "../api/undoStack"
import { serializeAppendable } from "../api/serializer/serialize"
import { editorPlanePtr } from "../pointers/editorPlanePtr"

export const [setEditorDragEvent, getEditorDragEvent] = store<
    | DragEvent
    | ((hitManager?: Appendable) => Appendable | undefined)
    | undefined
>(undefined)

const snap = (point: Point3dType) => {
    point.x = Math.round(point.x / 10) * 10
    point.y = Math.round(point.y / 10) * 10
    point.z = Math.round(point.z / 10) * 10
    return point
}

createEffect(() => {
    const e = getEditorDragEvent()
    const pointRef = createRef<Point3dType>({ x: 0, y: 0, z: 0 })
    const hitManagerRef = createRef<VisibleMixin | undefined>()

    const isDragEvent = e instanceof DragEvent
    const indicator = createMemo(() => {
        if (!isDragEvent) return
        const indicator = new HelperSphere(undefined)
        indicator.$disableSelection = true
        return indicator
    }, [isDragEvent])

    if (typeof e === "function") {
        const manager = e(hitManagerRef.current)
        if (!manager) return
        Object.assign(manager, snap(pointRef.current))
        emitSelectionTarget(manager)
        pushUndoStack({
            [manager.uuid]: {
                command: "create",
                ...serializeAppendable(manager, false)
            }
        })
        return
    }

    if (!isDragEvent || !indicator) return

    const [xNorm, yNorm] = normalizeClientPosition(e.clientX, e.clientY)
    const hit = raycast(selectionCandidates, {
        pointer: { x: xNorm, y: yNorm },
        include: editorPlanePtr[0]
    })
    hitManagerRef.current = hit?.manager
    const point = hit?.point ?? clientToWorld(e.clientX, e.clientY)
    Object.assign(indicator, point)
    pointRef.current = point
    return () => {
        !(getEditorDragEvent() instanceof DragEvent) && indicator.dispose()
    }
}, [getEditorDragEvent])
