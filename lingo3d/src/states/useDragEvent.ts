import { Point3d } from "@lincode/math"
import store, { createEffect, createMemo, createRef } from "@lincode/reactivity"
import ObjectManager from "../display/core/ObjectManager"
import { raycast } from "../display/core/StaticObjectManager/raycast/pickable"
import selectionCandidates, {
    unselectableSet
} from "../display/core/StaticObjectManager/raycast/selectionCandidates"
import Sphere from "../display/primitives/Sphere"
import clientToWorld from "../display/utils/clientToWorld"
import normalizeClientPosition from "../display/utils/normalizeClientPosition"
import { point2Vec, vec2Point } from "../display/utils/vec2Point"
import { emitSelectionTarget } from "../events/onSelectionTarget"

export const [setDragEvent, getDragEvent] = store<
    DragEvent | (() => ObjectManager) | undefined
>(undefined)

createEffect(() => {
    const e = getDragEvent()
    const pointRef = createRef<Point3d>({ x: 0, y: 0, z: 0 })

    const isDragEvent = e instanceof DragEvent
    const indicator = createMemo(() => {
        if (!isDragEvent) return
        const indicator = new Sphere()
        indicator.name = "indicator"
        unselectableSet.add(indicator)
        indicator.opacity = 0.5
        return indicator
    }, [isDragEvent])

    if (typeof e === "function") {
        const manager = e()
        Object.assign(manager, pointRef.current)
        emitSelectionTarget(manager)
        return
    }

    if (!isDragEvent || !indicator) return

    const [xNorm, yNorm] = normalizeClientPosition(e.clientX, e.clientY)
    const result =
        raycast(xNorm, yNorm, selectionCandidates)?.point ??
        point2Vec(clientToWorld(e.clientX, e.clientY))

    const point = vec2Point(result)
    Object.assign(indicator, point)
    pointRef.current = point

    return () => {
        !(getDragEvent() instanceof DragEvent) && indicator.dispose()
    }
}, [getDragEvent])
