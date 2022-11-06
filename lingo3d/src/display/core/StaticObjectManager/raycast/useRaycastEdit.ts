import {
    createEffect,
    createNestedEffect,
    createRef
} from "@lincode/reactivity"
import { isPositionedItem } from "../../../../api/core/PositionedItem"
import { mouseEvents } from "../../../../api/mouse"
import { onSceneGraphChange } from "../../../../events/onSceneGraphChange"
import {
    emitSelectionTarget,
    onSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getEditorModeComputed } from "../../../../states/useEditorModeComputed"
import { getMultipleSelection } from "../../../../states/useMultipleSelection"
import {
    pushMultipleSelectionTargets,
    getMultipleSelectionTargets,
    pullMultipleSelectionTargets,
    resetMultipleSelectionTargets,
    multipleSelectionGroupManagers
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

    createNestedEffect(() => {
        if (
            getEditorModeComputed() === "play" ||
            getTransformControlsDragging()
        )
            return

        getSelectionCandidates()
        const handle0 = onSceneGraphChange(() => getSelectionCandidates())
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
                        !multipleSelectionGroupManagers.has(currentTarget) &&
                        pushMultipleSelectionTargets(currentTarget)
                }
                firstMultipleSelection.current = false

                if (getMultipleSelectionTargets().includes(target))
                    pullMultipleSelectionTargets(target)
                else if (!multipleSelectionGroupManagers.has(target))
                    pushMultipleSelectionTargets(target)

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
            handle2.cancel()
            handle3.cancel()
            handle4.cancel()
            handle5.cancel()
        }
    }, [getEditorModeComputed, getTransformControlsDragging, multipleSelection])
}, [getEditorModeComputed, getTransformControlsDragging, getMultipleSelection])
