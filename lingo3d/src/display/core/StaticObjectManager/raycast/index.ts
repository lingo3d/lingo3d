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
import { isPositionedItem } from "../../../../api/core/PositionedItem"
import { onSelectionRecompute } from "../../../../events/onSelectionRecompute"
import { getEditing } from "../../../../states/useEditing"
import { getEditorMode } from "../../../../states/useEditorMode"
import selectionCandidates, {
    getSelectionCandidates
} from "./selectionCandidates"
import pickable from "./pickable"
import raycastPlay from "./raycastPlay"
import raycastPath from "./raycastPath"

createEffect(() => {
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createNestedEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (!getEditing()) return raycastPlay()

    if (getTransformControlsDragging()) return

    const mode = getEditorMode()
    if (mode === "path") return raycastPath()

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
