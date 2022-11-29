import {
    createEffect,
    createNestedEffect,
    createRef
} from "@lincode/reactivity"
import { hiddenAppendables } from "../../../../api/core/collections"
import { isPositionedItem } from "../../../../api/core/PositionedItem"
import { mouseEvents } from "../../../../api/mouse"
import { onSceneGraphChange } from "../../../../events/onSceneGraphChange"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getEditorPlay } from "../../../../states/useEditorPlay"
import { getMultipleSelection } from "../../../../states/useMultipleSelection"
import {
    pushMultipleSelectionTargets,
    getMultipleSelectionTargets,
    pullMultipleSelectionTargets,
    resetMultipleSelectionTargets
} from "../../../../states/useMultipleSelectionTargets"
import {
    getSelectionTarget,
    setSelectionTarget
} from "../../../../states/useSelectionTarget"
import { getTransformControlsDragging } from "../../../../states/useTransformControlsDragging"
import pickable from "./pickable"
import selectionCandidates, {
    getSelectionCandidates
} from "./selectionCandidates"

createEffect(() => {
    const multipleSelection = getMultipleSelection()
    const firstMultipleSelection = createRef(true)

    createNestedEffect(() => {
        !multipleSelection && (firstMultipleSelection.current = true)
    }, [multipleSelection])

    if (getEditorPlay() || getTransformControlsDragging()) return

    getSelectionCandidates()
    const handle0 = onSceneGraphChange(() => getSelectionCandidates())
    const handle1 = mouseEvents.on("click", () =>
        emitSelectionTarget(undefined)
    )
    let rightClick = false
    const handle2 = mouseEvents.on("rightClick", () => {
        rightClick = true
        queueMicrotask(() => {
            if (!rightClick) return
            rightClick = false
            emitSelectionTarget(undefined, true)
        })
    })
    const handle3 = pickable(
        ["click", "rightClick"],
        selectionCandidates,
        (target) => {
            emitSelectionTarget(target, rightClick)
            rightClick = false
        }
    )
    const handle4 = onSelectionTarget(({ target, rightClick, noDeselect }) => {
        if (multipleSelection) {
            if (!isPositionedItem(target) || rightClick) return

            if (firstMultipleSelection.current) {
                const currentTarget = getSelectionTarget()
                isPositionedItem(currentTarget) &&
                    !hiddenAppendables.has(currentTarget) &&
                    pushMultipleSelectionTargets(currentTarget)
            }
            firstMultipleSelection.current = false

            if (getMultipleSelectionTargets().includes(target))
                pullMultipleSelectionTargets(target)
            else if (!hiddenAppendables.has(target))
                pushMultipleSelectionTargets(target)

            return
        }
        resetMultipleSelectionTargets()
        setSelectionTarget(
            rightClick || noDeselect
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
    }
}, [getEditorPlay, getTransformControlsDragging, getMultipleSelection])
