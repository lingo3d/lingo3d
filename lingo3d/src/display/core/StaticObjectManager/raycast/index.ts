import { mouseEvents } from "../../../../api/mouse"
import {
    createEffect,
    createNestedEffect,
    createRef
} from "@lincode/reactivity"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import { getMultipleSelection } from "../../../../states/useMultipleSelection"
import {
    getMultipleSelectionTargets,
    pullMultipleSelectionTargets,
    pushMultipleSelectionTargets,
    resetMultipleSelectionTargets
} from "../../../../states/useMultipleSelectionTargets"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"
import { onSceneGraphChange } from "../../../../events/onSceneGraphChange"
import StaticObjectManager from ".."
import { isPositionedItem } from "../../../../api/core/PositionedItem"
import { onSelectionRecompute } from "../../../../events/onSelectionRecompute"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import { Cancellable } from "@lincode/promiselikes"
import {
    clickSet,
    mouseDownSet,
    mouseUpSet,
    mouseOverSet,
    mouseOutSet,
    mouseMoveSet
} from "./sets"
import selectionCandidates, {
    getSelectionCandidates
} from "./selectionCandidates"
import pickable from "./pickable"

createEffect(() => {
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createNestedEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (!getEditing()) {
        resetMultipleSelectionTargets()
        setSelectionTarget(undefined)

        const handle0 = pickable("click", clickSet, (obj, e) =>
            obj.onClick?.(e)
        )
        const handle1 = pickable("down", mouseDownSet, (obj, e) =>
            obj.onMouseDown?.(e)
        )
        const handle2 = pickable("up", mouseUpSet, (obj, e) =>
            obj.onMouseUp?.(e)
        )

        let moveSet = new Set<StaticObjectManager>()
        let moveSetOld = new Set<StaticObjectManager>()

        const handle3 = pickable("move", mouseOverSet, (obj, e) => {
            moveSet.add(obj)
            obj.outerObject3d.userData.eMove = e
        })
        const handle4 = pickable("move", mouseOutSet, (obj, e) => {
            moveSet.add(obj)
            obj.outerObject3d.userData.eMove = e
        })
        const handle5 = pickable("move", mouseMoveSet, (obj, e) => {
            moveSet.add(obj)
            obj.outerObject3d.userData.eMove = e
        })
        const handle6 = mouseEvents.on("move", () => {
            for (const obj of moveSet) {
                if (!moveSetOld.has(obj))
                    obj.onMouseOver?.(obj.outerObject3d.userData.eMove)

                obj.onMouseMove?.(obj.outerObject3d.userData.eMove)
            }
            for (const obj of moveSetOld)
                if (!moveSet.has(obj))
                    obj.onMouseOut?.(obj.outerObject3d.userData.eMove)

            moveSetOld = moveSet
            moveSet = new Set()
        })

        return () => {
            handle0.cancel()
            handle1.cancel()
            handle2.cancel()
            handle3.cancel()
            handle4.cancel()
            handle5.cancel()
            handle6.cancel()
        }
    }

    if (getTransformControlsDragging()) return

    const mode = getEditorMode()
    if (mode === "path") {
        const handle = new Cancellable()
        selectionCandidates.clear()

        import("../../../primitives/Sphere").then((module) => {
            const Sphere = module.default
            handle.watch(
                mouseEvents.on("click", (e) => {
                    setTimeout(() => {
                        if (handle.done || getSelectionTarget()) return

                        const target = new Sphere()
                        target.scale = 0.1
                        target.placeAt(e.point)
                        target.name = "point" + selectionCandidates.size
                        selectionCandidates.add(target.outerObject3d)
                        emitSelectionTarget(target)
                    })
                })
            )
        })
        const handle0 = onSceneGraphChange(() => {
            for (const obj of selectionCandidates)
                !obj.parent && selectionCandidates.delete(obj)
        })
        const handle1 = mouseEvents.on("click", () => emitSelectionTarget())
        const handle2 = pickable("click", selectionCandidates, (target) =>
            emitSelectionTarget(target)
        )
        const handle3 = onSelectionTarget(({ target }) => {
            if (multipleSelection) {
                if (!isPositionedItem(target)) return

                if (firstMultipleSelection.current) {
                    const currentTarget = getSelectionTarget()
                    isPositionedItem(currentTarget) &&
                        pushMultipleSelectionTargets(currentTarget)
                }
                firstMultipleSelection.current = false

                if (getMultipleSelectionTargets().includes(target))
                    pullMultipleSelectionTargets(target)
                else pushMultipleSelectionTargets(target)

                return
            }
            resetMultipleSelectionTargets()
            setSelectionTarget(target)
        })

        return () => {
            handle.cancel()
            handle0.cancel()
            handle1.cancel()
            handle2.cancel()
            handle3.cancel()
        }
    }

    getSelectionCandidates()
    const handle0 = onSceneGraphChange(getSelectionCandidates)
    const handle1 = onSelectionRecompute(() => {
        getSelectionCandidates()
        emitSelectionTarget()
    })
    const handle2 = mouseEvents.on("click", () => emitSelectionTarget())

    let rightClick = false
    const handle3 = mouseEvents.on("rightClick", () => {
        rightClick = true
        queueMicrotask(() => {
            if (!rightClick) return
            rightClick = false
            emitSelectionTarget(undefined, true)
        })
    })
    const handle4 = pickable(
        ["click", "rightClick"],
        selectionCandidates,
        (target) => {
            emitSelectionTarget(target, rightClick)
            rightClick = false
        }
    )
    const handle5 = onSelectionTarget(({ target, rightClick }) => {
        if (multipleSelection) {
            if (!isPositionedItem(target) || rightClick) return

            if (firstMultipleSelection.current) {
                const currentTarget = getSelectionTarget()
                isPositionedItem(currentTarget) &&
                    pushMultipleSelectionTargets(currentTarget)
            }
            firstMultipleSelection.current = false

            if (getMultipleSelectionTargets().includes(target))
                pullMultipleSelectionTargets(target)
            else pushMultipleSelectionTargets(target)

            return
        }
        resetMultipleSelectionTargets()
        setSelectionTarget(
            rightClick
                ? target
                : target === getSelectionTarget()
                ? undefined
                : target
        )
    })
    return () => {
        handle0.cancel()
        handle1.cancel()
        handle2.cancel()
        handle3.cancel()
        handle4.cancel()
        handle5.cancel()
    }
}, [
    getEditing,
    getEditorMode,
    getTransformControlsDragging,
    getMultipleSelection
])
